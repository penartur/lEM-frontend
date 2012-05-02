using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Configuration;
using System.IO;

namespace penartur.lEM.CLIWrapper {
	class Program {
		static void Main(string[] args) {
			using(
				TmpFile infile = new TmpFile(),
						outfile = new TmpFile(),
						logfile = new TmpFile(),
						errfile = new TmpFile()
			) {

				using(var inwriter = infile.GetWriter()) {
					while(true) {
						var line = Console.ReadLine();
						if(line == null) break;
						inwriter.WriteLine(line);
					}
				}

				var processStartInfo = new ProcessStartInfo(
					ConfigurationManager.AppSettings["lEM-executable-path"].ToString(),
					string.Format("\"{0}\" \"{1}\" \"{2}\" \"{3}\"", infile.fileName, outfile.fileName, errfile.fileName, logfile.fileName)
				);
				using(var processWrapper = new ProcessWrapper(processStartInfo)) {
					Console.WriteLine("Process started");
					Console.WriteLine(processWrapper.process.Id);
					processWrapper.process.WaitForExit(5 * 1000);
				}

				using(var errreader = errfile.GetReader()) {
					while(true) {
						var line = errreader.ReadLine();
						if(line == null) break;
						Console.Error.WriteLine(line);
					}
				}

				using(var outreader = outfile.GetReader()) {
					while(true) {
						var line = outreader.ReadLine();
						if(line == null) break;
						Console.Out.WriteLine(line);
					}
				}

				using(var logreader = logfile.GetReader()) {
					Console.Out.WriteLine("<<<log follows>>>");
					while(true) {
						var line = logreader.ReadLine();
						if(line == null) break;
						Console.Out.WriteLine(line);
					}
				}
			}
		}
	}
}
