import './../test-utils';
import { Application, ApplicationBuilder, HostToken } from '@sarina/hosting';
import { MemoryConfigurationSource, Configuration, IConfiguration } from '@sarina/configuration';

describe('sarina-hosting', () => {
	describe('implementation', () => {
		describe('ApplicationBuilder', () => {
			describe('setupConfiguration()', () => {
				it('should_raise_if_setup_is_null_or_undefined', () => {
					// Arrange
					const builder = new ApplicationBuilder();

					// Act
					const actionWithNull = () => builder.setupConfiguration(null);
					const actionWithUndefined = () => builder.setupConfiguration(undefined);

					// Assert
					expect(actionWithNull).toThrowSarinaError({
						code: 'x0001',
						data: { parameter: 'setup' },
					});
					expect(actionWithUndefined).toThrowSarinaError({
						code: 'x0001',
						data: { parameter: 'setup' },
					});
				});
				it('should_add_to_setupBlocks', async () => {
					// Arrange
					const setupBlock = (c) => {};
					const builder = new ApplicationBuilder();

					// Act
					builder.setupConfiguration(setupBlock);

					// Assert
					expect(builder.setupBlocks).toHaveLength(1);
					expect(builder.setupBlocks[0]).toMatchObject({
						target: 'IConfigurationBuilder',
						block: setupBlock,
					});
				});
			});
			describe('setupServices()', () => {
				it('should_raise_if_setup_is_null_or_undefined', () => {
					// Arrange
					const builder = new ApplicationBuilder();

					// Act
					const actionWithNull = () => builder.setupServices(null);
					const actionWithUndefined = () => builder.setupServices(undefined);

					// Assert
					expect(actionWithNull).toThrowSarinaError({
						code: 'x0001',
						data: { parameter: 'setup' },
					});
					expect(actionWithUndefined).toThrowSarinaError({
						code: 'x0001',
						data: { parameter: 'setup' },
					});
				});
				it('should_add_to_setupBlocks', async () => {
					// Arrange
					const setupBlock = (services) => {};
					const builder = new ApplicationBuilder();

					// Act
					builder.setupServices(setupBlock);

					// Assert
					expect(builder.setupBlocks).toHaveLength(1);
					expect(builder.setupBlocks[0]).toMatchObject({
						target: 'IServiceCollection',
						block: setupBlock,
					});
				});
			});
			describe('buildConfiguration()', () => {
				it('should_trigger_setup_configuration_blocks_by_passing_IConfigurationBuilder', async () => {
					// Arrange
					expect.assertions(4);
					const builder = new ApplicationBuilder();
					builder.setupConfiguration((c) => {
						expect(c.add).toBeInstanceOf(Function);
						expect(c.build).toBeInstanceOf(Function);
					});
					builder.setupConfiguration((c) => {
						expect(c.add).toBeInstanceOf(Function);
						expect(c.build).toBeInstanceOf(Function);
					});

					// Act
					await builder.buildConfiguration();

					// Assert
				});
				it('should_return_IConfiguration', async () => {
					// Arrange
					expect.assertions(1);
					const builder = new ApplicationBuilder();
					builder.setupConfiguration((c) => {
						c.add(new MemoryConfigurationSource({ v: 'key' }));
					});

					// Act
					const config = await builder.buildConfiguration();

					// Assert
					expect(config.getAsString('v')).toBe('key');
				});
			});
			describe('builderServiceProvider', () => {
				it('should_trigger_setup_services_blocks_by_passing_IServiceProvider_and_IConfiguration', () => {
					// Arrange
					expect.assertions(4);
					const configuration = new Configuration([]);
					const builder = new ApplicationBuilder();
					builder.setupServices((services, config) => {
						expect(services).not.toBeNull();
						expect(config).toBe(configuration);
					});
					builder.setupServices((services, config) => {
						expect(services).not.toBeNull();
						expect(config).toBe(configuration);
					});

					// Act
					builder.builderServiceProvider(configuration);

					// Assert
				});
				it('should_return_IServiceprovider', async () => {
					// Arrange
					const configuration = new Configuration([]);
					const builder = new ApplicationBuilder();
					builder.setupServices((provider, config) => {
						provider.addValue('t1', 'value');
					});

					// Act
					const sp = builder.builderServiceProvider(configuration);

					// Assert
					const value = await sp.get('t1');
					expect(value).toBe('value');
				});
			});
			describe('build()', () => {
				it('should_return_application_instance', async () => {
					// Arrange
					const builder = new ApplicationBuilder();

					// Act
					const app = await builder.build();

					// Assert
					expect(app).toBeInstanceOf(Application);
				});
				it('should_pass_hosts_to_application', async () => {
					// Arrange
					const builder = new ApplicationBuilder();
					builder.setupServices((s) => {
						s.addValue(HostToken, {
							start: async () => null,
							stop: async () => null,
						});
					});

					// Act
					const app = (await builder.build()) as Application;

					// Assert
					expect(app.hosts).toHaveLength(1);
				});
			});
		});
	});
});
