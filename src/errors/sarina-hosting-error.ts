import { ErrorBuilder } from './../utils/error-builder';

export class SarinaHostingError extends Error {
	public constructor(
		public readonly code: string,
		name: string,
		message: string,
		public readonly data: { [key: string]: string },
	) {
		super(message) /* istanbul ignore next */;
		this.name = name;
	}

	public static ParameterNullError(name: string) {
		return new ErrorBuilder('x0001', 'ParameterNullError')
			.message(`Parameter null error. '${name}' parameter can't be null`)
			.addData('parameter', name)
			.build();
	}
	public static InvalidParameterError(name: string, message: string) {
		return new ErrorBuilder('x0002', 'InvalidParameterError')
			.message(`'${name}' is invalid. ${message}`)
			.addData('parameter', name)
			.build();
	}
	public static ApplicationAlreadyStarted() {
		return new ErrorBuilder('x0003', 'ApplicationAlreadyStarted')
			.message('The application instance are already in running state.')
			.build();
	}
}
