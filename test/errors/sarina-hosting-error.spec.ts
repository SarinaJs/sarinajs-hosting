import { SarinaHostingError } from '@sarina/hosting';

describe('sarina-hosting', () => {
	describe('error', () => {
		describe('SarinaHostingError', () => {
			it('constructor_should_set_code_name_message_data', () => {
				// Arrange

				// Act
				const data = new SarinaHostingError('x001', 'myError', 'myMessage', { k: 'value' });

				// Assert
				expect(data.code).toBe('x001');
				expect(data.message).toBe('myMessage');
				expect(data.name).toBe('myError');
				expect(data.data['k']).toBe('value');
			});
			it('ArgumentNullException_test', () => {
				// Act
				const error = SarinaHostingError.ParameterNullError('name');

				// Assert
				expect(error.code).toBe('x0001');
				expect(error.name).toBe('ParameterNullError');
				expect(error.message).toBe("x0001: Parameter null error. 'name' parameter can't be null");
				expect(error.data['parameter']).toBe('name');
			});
			it('InvalidParameterError_test', () => {
				// Act
				const error = SarinaHostingError.InvalidParameterError('name', 'name is reuired');

				// Assert
				expect(error.code).toBe('x0002');
				expect(error.name).toBe('InvalidParameterError');
				expect(error.message).toBe("x0002: 'name' is invalid. name is reuired");
				expect(error.data['parameter']).toBe('name');
			});
			it('ApplicationAlreadyStarted', () => {
				// Act
				const error = SarinaHostingError.ApplicationAlreadyStarted();

				// Assert
				expect(error.code).toBe('x0003');
				expect(error.name).toBe('ApplicationAlreadyStarted');
				expect(error.message).toBe('x0003: The application instance are already in running state.');
			});
		});
	});
});
