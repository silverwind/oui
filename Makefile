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

patch: lint npm-patch publish deploy
minor: lint npm-minor publish deploy
major: lint npm-major publish deploy

.PHONY: lint touch publish update patch minor major npm-patch npm-minor npm-major
