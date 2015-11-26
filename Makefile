lint:
	eslint --color --quiet *.js

publish:
	git push -u --tags origin master
	npm publish

update:
	ncu -ua
	rm -rf node_modules
	npm install

npm-patch:
	npm version patch

npm-minor:
	npm version minor

npm-major:
	npm version major

patch: lint npm-patch publish
minor: lint npm-minor publish
major: lint npm-major publish

.PHONY: lint touch publish update patch minor major npm-patch npm-minor npm-major
