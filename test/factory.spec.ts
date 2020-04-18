import { Factory, ApplicationBuilder as ApplicationBuilder, IApplicationBuilder } from '@sarina/hosting';

describe('sarina-hosting', () => {
	describe('factory', () => {
		describe('Factory', () => {
			describe('create()', () => {
				it('should_return_defaultAppBuilder_byDefault', () => {
					// Arrange

					// Act
					const appBuilder = Factory.create();

					// Assert
					expect(appBuilder).toBeInstanceOf(ApplicationBuilder);
				});
			});
		});
	});
});
