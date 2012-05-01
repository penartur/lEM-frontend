using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace CLIWrapper {
	class TmpFile : IDisposable {

		private class FinalStream : ProxyStream {

			private readonly TmpFile file;

			public FinalStream(TmpFile file, Stream stream)
				: base(stream) {
				this.file = file;
			}

			protected override void Dispose(bool disposing) {
				base.Dispose(disposing);
				if(disposing) {
					this.file.Dispose();
				}
			}

		}

		public readonly string fileName;

		public TmpFile() {
			this.fileName = Path.GetTempFileName();
		}

		public TmpFile(string extension) {
			this.fileName = Path.Combine(Path.GetTempPath(), DateTime.Now.Ticks + "-" + Guid.NewGuid().ToString() + extension);
			using(new FileStream(this.fileName, FileMode.CreateNew, FileAccess.ReadWrite)) //Dirty hack to create the file
			{
			}
		}

		public StreamReader GetReader() {
			return new StreamReader(this.fileName);
		}

		public StreamWriter GetWriter() {
			return new StreamWriter(this.fileName);
		}

		public Stream GetReadStream() {
			return new FileStream(this.fileName, FileMode.Open, FileAccess.Read);
		}

		/// <summary>
		/// When the returned stream will be closed, the file itself will be deleted
		/// </summary>
		/// <returns></returns>
		public Stream GetFinalReadStream() {
			return new FinalStream(this, this.GetReadStream());
		}

		public Stream GetWriteStream() {
			return new FileStream(this.fileName, FileMode.Open, FileAccess.Write);
		}

		public bool IsEmpty {
			get {
				return (new FileInfo(this.fileName)).Length == 0;
			}
		}

		public void Dispose() {
			File.Delete(this.fileName);
		}

	}
}
