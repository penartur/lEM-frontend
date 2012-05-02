using System;
using System.Collections.Generic;
using System.Text;
using System.IO;

namespace penartur.lEM.CLIWrapper {
	class ProxyStream : Stream {

		private Stream inner;

		public ProxyStream(Stream inner) {
			this.inner = inner;
		}

		public override bool CanRead {
			get { return this.inner.CanRead; }
		}

		public override bool CanSeek {
			get { return this.inner.CanSeek; }
		}

		public override bool CanWrite {
			get { return this.inner.CanWrite; }
		}

		public override void Flush() {
			this.inner.Flush();
		}

		public override long Length {
			get { return this.inner.Length; }
		}

		public override long Position {
			get {
				return this.inner.Position;
			}
			set {
				this.inner.Position = value;
			}
		}

		public override int Read(byte[] buffer, int offset, int count) {
			return this.inner.Read(buffer, offset, count);
		}

		public override long Seek(long offset, SeekOrigin origin) {
			return this.inner.Seek(offset, origin);
		}

		public override void SetLength(long value) {
			this.inner.SetLength(value);
		}

		public override void Write(byte[] buffer, int offset, int count) {
			this.inner.Write(buffer, offset, count);
		}

		protected override void Dispose(bool disposing) {
			if(disposing) {
				if(this.inner != null) this.inner.Dispose();
			} else {
				this.inner = null;
			}
		}

	}
}
