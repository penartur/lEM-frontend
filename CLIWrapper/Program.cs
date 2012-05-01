using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Configuration;

namespace CLIWrapper {
	class Program {
		static void Main(string[] args) {
			using(
				TmpFile infile = new TmpFile(),
						outfile = new TmpFile(),
						logfile = new TmpFile()
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
					string.Format("\"{0}\" \"{1}\" \"{2}\"", infile.fileName, outfile.fileName, logfile.fileName)
				);
				using(var processWrapper = new ProcessWrapper(processStartInfo)) {
					Console.WriteLine("Process started");
					Console.WriteLine(processWrapper.process.Id);
					Console.ReadLine();
				}

				using(var logreader = logfile.GetReader()) {
					while(true) {
						var line = logreader.ReadLine();
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
			}
		}
	}
}
