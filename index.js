"use strict";


(function(){
    console.log("Starting the app.");



    function reportPackage(pkg) {
        console.log("The package name is %s  and the version is v. %s", pkg.name, pkg.version);
        console.log("The original author is %s", pkg.author);
        console.log("And it has %d dependecies.", pkg.dependencies.length);
    }

    function readPackageInfo(packageFile) {

        //First declare the return value var
        var packageInfo = false;

        //We need fs module
        var fs = require("fs");

        //Check if we have access to the file
        var stats = fs.statSync(packageFile);

        if (stats.isFile()) {
            try {
                fs.accessSync(packageFile, fs.F_OK | fs.R_OK);

                var contents = fs.readFileSync(packageFile, "utf8");

                packageInfo = JSON.parse(contents);

                //Just to make us sure we didn't process a different file and retrieve a secure trust information
                //about the package
                if(!packageInfo.name || !packageInfo.author || !packageInfo.version) {
                    packageInfo = false;
                }
            } catch (e) {
                packageInfo = false;
            }
        }

        return packageInfo;
    }

    function moduleVersion(module, callBack) {
        var path = require("path");
        var fs = require("fs");
        var node_modules = path.join(".", "node_modules");
        var error = false;

        try {
            fs.accessSync(node_modules, fs.R_OK);

            var modulePath = path.join(node_modules, module, "package.json");

            var packageInfo = readPackageInfo(modulePath);

            var error = packageInfo === false;
        } catch (e) {
            console.log(e);
            error = true;
        }

        callBack(error, packageInfo);
    }

    var currentPackage = readPackageInfo("package.json");


    if (currentPackage !== false) {
        console.log("For the current package %s (v. %s)", currentPackage.name, currentPackage.version);
        console.log("The dependencies are:");

        for (var module in currentPackage.dependencies) {
            var moduleInfo = moduleVersion(module, function(error, packageInfo) {
                if (error) {
                    console.log("Could not read %s module package.json, perhaps npm install?", module);
                    return;
                }

                console.log("\tThe dependency module \"%s\" version is %s", packageInfo.name, packageInfo.version);
                console.log("\tThe original author is: %s <%s>", packageInfo.author.name || "No name", packageInfo.author.email || "No email address");
                console.log("\tDon't forget it!\n");
            });
        }
    } else {
        console.log("Could not read the package.json");
    }
    //*/

}());