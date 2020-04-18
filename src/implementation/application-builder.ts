import { Application } from './application';
import { SarinaHostingError } from '../errors';
import { IServiceCollection, ServiceCollection } from '@sarina/di';
import { IConfigurationBuilder, IConfiguration, ConfigurationBuilder } from '@sarina/configuration';
import { IApplication, IApplicationBuilder, HostToken, IHost } from '../abstraction';

export type SetupBlock = SetupConfigurationBlock | SetupServicesBlock;
export interface SetupConfigurationBlock {
	target: 'IConfigurationBuilder';
	block: (builder: IConfigurationBuilder) => void;
}
export interface SetupServicesBlock {
	target: 'IServiceCollection';
	block: (services: IServiceCollection, config: IConfiguration) => void;
}

export class ApplicationBuilder implements IApplicationBuilder {
	public setupBlocks: SetupBlock[] = [];

	public constructor() {}

	public setupConfiguration(setup: (builder: IConfigurationBuilder) => void): IApplicationBuilder {
		if (!setup) throw SarinaHostingError.ParameterNullError('setup');

		this.setupBlocks.push({
			target: 'IConfigurationBuilder',
			block: setup,
		});
		return this;
	}
	public setupServices(setup: (services: IServiceCollection, config: IConfiguration) => void): IApplicationBuilder {
		if (!setup) throw SarinaHostingError.ParameterNullError('setup');

		this.setupBlocks.push({
			target: 'IServiceCollection',
			block: setup,
		});
		return this;
	}

	public async build(): Promise<IApplication> {
		// get configuration
		const config = await this.buildConfiguration();

		// get service-provider
		const provider = await this.builderServiceProvider(config);

		// resolve hosts instances
		const hosts = await provider.getAll<IHost>(HostToken);

		// instantiate application instance
		return new Application(hosts);
	}
	public async buildConfiguration() {
		const configurationBuilder = new ConfigurationBuilder();
		this.setupBlocks //
			.filter((s) => s.target == 'IConfigurationBuilder') //
			.map((s) => s as SetupConfigurationBlock)
			.forEach((b) => b.block(configurationBuilder));
		return await configurationBuilder.build();
	}
	public builderServiceProvider(config: IConfiguration) {
		const serviceCollection: IServiceCollection = new ServiceCollection();
		this.setupBlocks //
			.filter((s) => s.target == 'IServiceCollection') //
			.map((s) => s as SetupServicesBlock)
			.forEach((b) => b.block(serviceCollection, config));

		return serviceCollection.build();
	}
}
