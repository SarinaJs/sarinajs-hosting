import { IServiceCollection } from '@sarina/di';
import { IApplication } from './application.interface';
import { IConfigurationBuilder, IConfiguration } from '@sarina/configuration';

export interface IApplicationBuilder {
	setupConfiguration(setup: (builder: IConfigurationBuilder) => void): IApplicationBuilder;
	setupServices(setup: (services: IServiceCollection, config: IConfiguration) => void): IApplicationBuilder;
	build(): Promise<IApplication>;
}
