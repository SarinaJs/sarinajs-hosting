import './../test-utils';
import { Application, IHost } from '@sarina/hosting';

describe('sarina-hosting', () => {
	describe('implementation', () => {
		describe('Application', () => {
			describe('constructor', () => {
				it('should_check_parameters', () => {
					// Arrange

					// Arrange
					const action = () => new Application(null);

					// Assert
					expect(action).toThrowSarinaError({
						code: 'x0001',
						data: { parameter: 'hosts' },
					});
				});
			});
			describe('startHost()', () => {
				it('should_start_host_and_return_promise', async () => {
					// Arrange
					const host: IHost = {
						start: async () => null,
						stop: async () => null,
					};
					const app = new Application([host]);

					// Act
					const runner = app.startHost(host);

					// Assert
					expect(runner).toBeInstanceOf(Promise);
				});
				it('should_trigger_host_start_method', async () => {
					// Arrange
					expect.assertions(1);
					const host: IHost = {
						start: async () => {
							expect(true).toBeTruthy();
						},
						stop: async () => null,
					};
					const app = new Application([host]);

					// Act
					await app.startHost(host);

					// Assert
				});
			});
			describe('stopHost()', () => {
				it('should_stop_host_and_return_promise', async () => {
					// Arrange
					const host: IHost = {
						start: async () => null,
						stop: async () => null,
					};
					const app = new Application([host]);

					// Act
					const runner = app.stopHost(host);

					// Assert
					expect(runner).toBeInstanceOf(Promise);
				});
				it('should_trigger_host_start_method', async () => {
					// Arrange
					expect.assertions(1);
					const host: IHost = {
						start: async () => null,
						stop: async () => {
							expect(true).toBeTruthy();
						},
					};
					const app = new Application([host]);

					// Act
					await app.stopHost(host);

					// Assert
				});
			});
			describe('start()', () => {
				it('should_rais_if_application_is_already_running', async () => {
					// Arrange
					const app = new Application([]);
					app.isRunning = true;

					// Act
					const action = async () => app.start();

					// Assert
					await expect(action).toThrowSarinaError({
						code: 'x0003',
						name: 'ApplicationAlreadyStarted',
					});
				});
				it('should_set_isRunning_to_true', () => {
					// Arrange
					const app = new Application([
						{
							start: () => {
								return new Promise((r) => {
									setTimeout(() => {
										r();
									}, 5);
								});
							},
							stop: async () => null,
						},
					]);

					// Act
					app.start();

					// Assert
					expect(app.isRunning).toBeTruthy();
				});
				it('should_set_isRunning_to_false_after_all_hosts_stoped', async () => {
					// Arrange
					const app = new Application([
						{
							start: async () => null,
							stop: async () => null,
						},
					]);

					// Act
					await app.start();

					// Assert
					expect(app.isRunning).toBeFalsy();
				});
				it('should_execute_all_hosts', async () => {
					// Arrange
					expect.assertions(2);
					const host1: IHost = {
						start: async () => expect(true).toBeTruthy(),
						stop: async () => null,
					};
					const host2: IHost = {
						start: async () => expect(true).toBeTruthy(),
						stop: async () => null,
					};
					const app = new Application([host1, host2]);

					// Act
					await app.start();

					// Assert
				});
				it('should_execute_all_hosts_parallel', async () => {
					// Arrange
					let value = 0;
					expect.assertions(3);
					const host1: IHost = {
						start: () => {
							return new Promise((resolve, reject) => {
								setTimeout(() => {
									expect(value).toBe(1);
									value = 2;
									resolve();
								}, 1);
							});
						},
						stop: async () => null,
					};
					const host2: IHost = {
						start: async () => {
							expect(value).toBe(0);
							value = 1;
						},
						stop: async () => null,
					};
					const app = new Application([host1, host2]);

					// Act
					await app.start();

					// Assert
					expect(value).toBe(2);
				});
				it('should_stop_on_SIGTERM', async () => {
					// Arrange
					const processEvents = {};
					process.on = jest.fn((signal, cb) => {
						processEvents[signal] = cb;
					}) as any;
					process.kill = jest.fn((pid, signal) => {
						processEvents[signal]();
					});

					expect.assertions(2);
					class SampelHost implements IHost {
						public isCanceled = false;

						start(): Promise<void> {
							return new Promise((r) => {
								this.tick(() => {
									r();
								});
							});
						}
						async stop(): Promise<void> {
							expect(true).toBeTruthy();
							this.isCanceled = true;
						}
						tick(cb: () => void): void {
							setTimeout(() => {
								if (this.isCanceled) {
									return cb();
								}
								this.tick(cb);
							}, 1);
						}
					}
					const app = new Application([new SampelHost()]);
					const runner = app.start();

					// Act
					process.kill(process.pid, 'SIGTERM');
					await runner;

					// Assert
					await runner;
					expect(app.isRunning).toBe(false);
				});
			});
		});
	});
});
