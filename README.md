lEM-frontend
============

Provides an useable web-based graphical interface for [lEM](http://www.tilburguniversity.edu/nl/over-tilburg-university/schools/socialsciences/organisatie/departementen/mto/onderzoek/software/) statistical software.

Currently, the cool interface is only implemented for latent class analysis, and supports only unrestricted, log-linear, hierarchical log-linear (aka linear-logistic) and non-parametric ordinal (aka Croon's) models.

Additionally, it provides the **raw** interface which allows one to directly execute an arbitrary lEM commands from the web.

## Installation

1. Download the **LEMWIN** binaries from [there](http://www.tilburguniversity.edu/nl/over-tilburg-university/schools/socialsciences/organisatie/departementen/mto/onderzoek/software/) and unpack it. Note that the destination path should have no spaces in it (and, preferrably, to be compatible with 8.3 format).
2. Build the `CLIWrapper` project and point its `App.config` to the `lem95.exe` you obtained on step 1.
3. Deploy the `Frontend` project and point its `config.js` to the `CLIWrapper` binary. Additionally you may configure the listening port (or initialize it with `process.env.port` if you're have Node.js behind `iisnode` or similar servers) and toggle the cluster mode (in case you're using Node's built-in web server).

## Screenshots

[![Latent class analysis](http://cloud.github.com/downloads/penartur/lEM-frontend/lcm.png)](http://cloud.github.com/downloads/penartur/lEM-frontend/lcm.png)
