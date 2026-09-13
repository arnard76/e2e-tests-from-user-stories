/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomlySample } from '../src/util/array';
import test from '@playwright/test';
test.describe.configure({ mode: 'serial' });

export class PersonWant {
	label: string;

	constructor(label: string) {
		this.label = label;
	}
}

export class Person {
	static connections: {
		// the wants/needs don't mention which tool is used
		wantsTo: Record<PersonWant['label'], Record<Tool['name'], Tool['featureList'][number]['name'][]>>;
	} = { wantsTo: {} };

	/* Relevant properties */
	name: string; // how to call them or refer to them
	email: string; // how to contact them
	flows: Record<PersonWant['label'], Action[]>;

	/* New Person is born   */
	constructor(name: string, email?: string) {
		this.name = name;
		this.email = email || '';
		this.flows = {};
	}

	can(doSpecificWant: keyof (typeof Person)['connections']['wantsTo']) {
		return {
			byDoingTheFollowingActions: (actions: Action[]) => {
				return this.byDoingTheFollowingActions(doSpecificWant, actions);
			}
		};
	}

	byDoingTheFollowingActions(doSpecificWant: PersonWant['label'], actions: Action[]) {
		this.flows[doSpecificWant] = actions;
		return { test: () => this.test(doSpecificWant) };
	}

	private async test(doSpecificWant: PersonWant['label']) {
		// Combine UI actions and signs into a full test
		//  (using test isolation false)

		// TODO: DX: show which features are being tested
		// e.g. person P1 is doing W1 using features
		return test(`${this.name} can ${doSpecificWant}`, async ({ page, baseURL }, ...params) => {
			for (const action of this.flows[doSpecificWant]) {
				if (action.uiAction) {
					await action.performViaUI({ page, baseURL } as any, ...params);
				} else {
					console.warn(
						`Test for '${this.name} trying to ${doSpecificWant}' can't continue until UI actions are defined for '${action.name}'`
					);
					return;
				}
			}
		});
	}

	static wantsTo<PersonType extends typeof Person>(want: keyof PersonType['connections']['wantsTo'] & string) {
		if (!this.connections.wantsTo[want]) this.connections.wantsTo[want] = {};
		return {
			canUseTool: <SpecificTool extends Tool>(tool: SpecificTool) => {
				return this.canUseTool(tool, want);
			}
		};
	}

	static canUseTool<SpecificTool extends Tool>(tool: SpecificTool, forWant: PersonWant['label']) {
		if (!this.connections.wantsTo[forWant][tool.name]) this.connections.wantsTo[forWant][tool.name] = [];

		return {
			becauseItHasFeatures: (features: (keyof SpecificTool['features'] & string)[]) => {
				return this.becauseItHasFeatures(features, forWant, tool);
			}
		};
	}

	static becauseItHasFeatures<SpecificTool extends Tool>(
		features: (keyof SpecificTool['features'] & string)[],
		forWant: PersonWant['label'],
		onTool: SpecificTool
	) {
		const currentMatchingFeatures = this.connections.wantsTo[forWant][onTool.name];
		currentMatchingFeatures.push(...features);
		this.connections.wantsTo[forWant][onTool.name] = [...new Set(currentMatchingFeatures)];
		return Person;
	}
}

export function personWhoIs<PersonType extends Pick<typeof Person, 'connections' | 'wantsTo'>>(
	personType: (new (...args: any[]) => Person) & PersonType
) {
	return {
		wantsTo: (want: keyof PersonType['connections']['wantsTo'] & string) => (personType as PersonType).wantsTo(want)
	};
}

export function thisPerson<PersonType extends { connections: { wantsTo: any } }, SpecificPerson extends Person>(person: SpecificPerson) {
	return {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		whoIsA<PersonType1 extends PersonType>(personType: PersonType1) {
			return {
				can: (want: keyof PersonType1['connections']['wantsTo'] & string) => ({
					...person.can(want),
					andAlsoCan: this.whoIsA(personType).can
				})
			};
		}
	};
}

export abstract class Tool {
	name: string;

	features: Record<Feature['name'], Record<Feature['actions'][number]['name'], Feature['actions'][number] | ((...args: any[]) => Action)>> =
		{} as const;

	get featureList(): Feature[] {
		return Object.entries(this.features).map(([name, featureDetails]) => {
			return new Feature(name, featureDetails);
		});
	}

	constructor(name?: string) {
		this.name = name || this.constructor.name;
	}
}

export class Feature {
	name: string;
	actions: Record<Action['name'], Action>;

	constructor(name: string, actions: Record<Action['name'], Action | ((...args: any[]) => Action)> = {}) {
		this.name = name;

		const justActions = Object.fromEntries(
			Object.entries(actions).map(([name, action]) => {
				return [name, typeof action === 'function' ? action() : action];
			})
		);

		this.actions = justActions;
	}

	get actionsList(): Action[] {
		return Object.values(this.actions);
	}
}

export class Action {
	name: string;
	uiAction: Parameters<typeof test>[2] | null;

	constructor(name: string) {
		this.name = name;
		this.uiAction = null;
	}

	setUIAction(uiAction: Parameters<typeof test>[2]) {
		this.uiAction = uiAction;
		return this;
	}

	get testable() {
		return this.uiAction;
	}

	async performViaUI(...params: Parameters<NonNullable<typeof this.uiAction>>) {
		if (this.uiAction === null) {
			console.warn();
			return;
		}

		await this.uiAction(...params);
	}

	static oneOf(...actions: Action[]) {
		return randomlySample(actions);
	}

	static combine(combinedName: string, ...actions: Action[]) {
		return action(combinedName).setUIAction(async ({ page }, params) => {
			actions.forEach((action) => {
				action.performViaUI({ page } as any, params);
			});
		});
	}
}

export function action(actionName: Action['name']) {
	return new Action(actionName);
}
