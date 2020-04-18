import { Token } from '@sarina/di';

export const HostToken: Token = Symbol('IHost');

export interface IHost {
	start(): Promise<void>;
	stop(): Promise<void>;
}
