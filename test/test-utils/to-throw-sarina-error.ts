import { SarinaHostingError } from '@sarina/hosting';

export {};

export interface toMatch {
	code?: string;
	name?: string;
	message?: string;
	data?: { [key: string]: any };
}

declare global {
	namespace jest {
		interface Matchers<R> {
			toThrowSarinaError(match: toMatch): R;
		}
	}
}

expect.extend({
	toThrowSarinaError(action: () => void, match: toMatch) {
		const validateError = (sarinaError: SarinaHostingError) => {
			if (sarinaError == null) return { message: () => `expected ${sarinaError} to be error`, pass: false };

			if (match.code && sarinaError.code != match.code)
				return { message: () => `expected error code '${sarinaError.code}' to be ${match.code}`, pass: false };

			if (match.name && sarinaError.name != match.name)
				return { message: () => `expected error name '${sarinaError.name}' to be ${match.name}`, pass: false };

			if (match.message && sarinaError.message != match.message)
				return { message: () => `expected error message '${sarinaError.message}' to be ${match.message}`, pass: false };

			if (match.data && JSON.stringify(sarinaError.data) != JSON.stringify(match.data))
				return {
					message: () =>
						`expected error data '${JSON.stringify(sarinaError.data)}' to be ${JSON.stringify(match.data)}`,
					pass: false,
				};

			return { message: () => `expected ${sarinaError} to be valid error`, pass: true };
		};

		try {
			const result: any = action();
			if (result instanceof Promise) {
				return new Promise((resolve, reject) => {
					result
						.catch((e) => {
							resolve(validateError(e as SarinaHostingError));
						})
						.then(() => {
							reject({ message: () => `expected ${action} to throw SarinaError`, pass: false });
						});
				});
			} else {
				return { message: () => `expected ${action} to throw SarinaError`, pass: false };
			}
		} catch (e) {
			return validateError(e as SarinaHostingError);
		}
	},
});
