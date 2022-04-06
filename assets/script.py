print('Hello from python')

            # // var dataToSend;
            # // // spawn new child process to call the python script
            # // var python = spawn('py', ['./assets/script.py'])

            # // // collect data from script
            # // python.stdout.on('data', function (data) {
            # //     winston.info("collect data from script")
            # //     dataToSend = data.toString();
            # //     winston.info(dataToSend)
            # // });

            # // python.stderr.on('data', (data) => {
            # //     winston.error(data.toString)
            # // });

            # // // in close event Py
            # // python.on('exit', (code) => {
            # //     winston.info("in close event Py")
            # //     // send data to browser
            # //     res.status(200).send(dataToSend)
            # // });