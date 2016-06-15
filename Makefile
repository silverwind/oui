lint:
	eslint *.js

publish:
	git push -u --tags origin master
	npm publish

update:
	ncu --packageFile package.json -ua
	rm -rf node_modules
	npm install

npm-patch:
	mv node_modules _node_modules
	npm version patch
	mv _node_modules node_modules

npm-minor:
	mv node_modules _node_modules
	npm version minor
	mv _node_modules node_modules

npm-major:
	mv node_modules _node_modules
	npm version major
	mv _node_modules node_modules

patch: lint npm-patch publish
minor: lint npm-minor publish
major: lint npm-major publish

.PHONY: lint publish update npm-patch npm-minor npm-major patch minor major
