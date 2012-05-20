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

				Console.Out.WriteLine();
				Console.WriteLine("### Debug");
				var processStartInfo = new ProcessStartInfo(
					ConfigurationManager.AppSettings["lEM-executable-path"].ToString(),
					string.Format("\"{0}\" \"{1}\" \"{2}\" \"{3}\"", infile.fileName, outfile.fileName, errfile.fileName, logfile.fileName)
				);
				using(var processWrapper = new ProcessWrapper(processStartInfo)) {
					Console.WriteLine("Process started");
					Console.WriteLine(processWrapper.process.StartInfo.FileName);
					Console.WriteLine(processWrapper.process.StartInfo.Arguments);
					Console.WriteLine(processWrapper.process.Id);
					processWrapper.process.WaitForExit(5 * 1000);
				}

				using(var errreader = errfile.GetReader()) {
					bool first = true;
					while(true) {
						var line = errreader.ReadLine();
						if(line == null) break;
						if(first) {
							first = false;
							Console.Error.WriteLine();
							Console.Error.WriteLine("### Error");
						}
						Console.Error.WriteLine(line);
					}
				}

				using(var outreader = outfile.GetReader()) {
					Console.Out.WriteLine();
					Console.Out.WriteLine("### Output");
					while(true) {
						var line = outreader.ReadLine();
						if(line == null) break;
						Console.Out.WriteLine(line);
					}
				}

				using(var logreader = logfile.GetReader()) {
					Console.Out.WriteLine();
					Console.Out.WriteLine("### Log");
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
