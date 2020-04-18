import { IApplicationBuilder } from './abstraction';
import { ApplicationBuilder } from './implementation';

export class Factory {
	public static create(): IApplicationBuilder {
		return new ApplicationBuilder();
	}
}
