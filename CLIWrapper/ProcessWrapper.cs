using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;

namespace CLIWrapper {
	class ProcessWrapper : IDisposable {

		public readonly Process process;

		public ProcessWrapper(ProcessStartInfo processStartInfo) {
			this.process = Process.Start(processStartInfo);
		}

		void IDisposable.Dispose() {
			if(!this.process.HasExited) {
				this.process.Kill();
				this.process.WaitForExit();
			}
			this.process.Dispose();
		}

	}
}
