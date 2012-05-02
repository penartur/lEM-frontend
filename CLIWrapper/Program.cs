using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;
using System.Configuration;
using System.IO;

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
					var now = DateTime.Now;
					while(DateTime.Now - now < TimeSpan.FromSeconds(60)) {
						if(new FileInfo(outfile.fileName).Length > 0) {
							System.Threading.Thread.Sleep(TimeSpan.FromSeconds(0.1)); //let it finish the writing
							break;
						} else {
							System.Threading.Thread.Sleep(TimeSpan.FromSeconds(0.1));
						}
					}
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
