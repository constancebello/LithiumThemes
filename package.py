import requests
import json
import argparse
import os
import subprocess
import shutil

os.chdir(os.path.dirname(os.path.abspath(__file__)))

parser = argparse.ArgumentParser()
parser.add_argument('packages', nargs='+')

packages = parser.parse_args().packages

for package in packages:
    with open('data/' + package + '.json') as jsonFile:
        data = json.load(jsonFile)
    inputVersion = raw_input('Version of package ' + package + ' (' + data['version'] + '): ')
    if inputVersion:
        data['version'] = inputVersion
        with open('data/' + package + '.json', 'w') as jsonFile:
            json.dump(data, jsonFile)
    os.makedirs('packages/' + package + '/Library/Lithium')
    for script in data['files']:
        with open('scripts/' + script) as scriptFile:
            request = requests.post('https://closure-compiler.appspot.com/compile', data={
                'js_code': scriptFile.read(),
                'compilation_level': 'SIMPLE_OPTIMIZATIONS',
                'output_info': 'compiled_code',
                'output_format': 'text'
            })
        compiled = request.text.replace('\n', '')
        compiled = compiled[compiled.find('('):-1]
        with open('packages/' + package + '/Library/Lithium/' + script, 'w') as compiledFile:
            compiledFile.write(compiled)
    os.makedirs('packages/' + package + '/DEBIAN')
    with open('packages/' + package + '/DEBIAN/control', 'a') as control:
        control.write('Package: ' + package + '\n')
        control.write('Name: ' + data['name'] + '\n')
        control.write('Depends: lithium' + (' (>= 2.0)' if 'lpm' in data else '') + '\n')
        control.write('Version: ' + data['version'] + '\n')
        control.write('Architecture: iphoneos-arm\n')
        control.write('Description: ' + data['description'] + '\n')
        control.write('Author: ' + data['author'] + '\n')
        control.write('Maintainer: ' + data['author'] + '\n')
        control.write('Section: Themes (Lithium)\n')
        control.write('Depiction: ' + data['depiction'] + '\n')
    subprocess.call(['dpkg-deb', '-Zgzip', '-b', 'packages/' + package, 'packages/' + package + '.deb'])
    subprocess.call(['zip', 'packages/' + package + '.deb.zip', 'packages/' + package + '.deb'])
    shutil.rmtree('packages/' + package)
