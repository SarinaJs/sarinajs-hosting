import { IApplication, IHost } from '../abstraction';
import { SarinaHostingError } from '../errors';

export class Application implements IApplication {
	public runningProcess: Promise<void[]>;
	public isRunning = false;

	public constructor(public readonly hosts: IHost[]) {
		if (hosts == null) throw SarinaHostingError.ParameterNullError('hosts');
		this.hosts = hosts;
	}

	public async start(): Promise<void> {
		if (this.isRunning == true) throw SarinaHostingError.ApplicationAlreadyStarted();

		// set status to running
		this.isRunning = true;

		// starting all hosts asynced
		const startedHosts = this.hosts.map((host) => this.startHost(host));

		// contact all running host as one single promie,
		//	in order to have control on process
		this.runningProcess = Promise.all(startedHosts);

		// gradefull terminating
		process.on('SIGTERM', () => {
			this.hosts.map((host) => this.stopHost(host));
		});

		// waits as long as hosts are running
		await this.runningProcess;

		this.isRunning = false;
	}
	public async startHost(host: IHost): Promise<void> {
		await host.start();
	}
	public async stopHost(host: IHost): Promise<void> {
		await host.stop();
	}
}
