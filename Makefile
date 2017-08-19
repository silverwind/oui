VERSION := $(shell jq -r .version < package.json)
WEB := oui.web.js
WEBMIN := oui.web.min.js
NODE := node --trace-deprecation --throw-deprecation
ESLINT := node_modules/.bin/eslint
UGLIFY := node_modules/.bin/uglifyjs
NCU := node_modules/.bin/ncu
SEMVER := node_modules/.bin/semver

lint:
	eslint --color --quiet --ignore-pattern *.min.js *.js

test:
	$(MAKE) lint
	$(NODE) test.js

min:
	$(UGLIFY) $(WEB) -o $(WEBMIN) --mangle --compress --screw-ie8 --unsafe --comments '/oui/'

publish:
	git push -u --tags origin master
	npm publish

update:
	$(NCU) --packageFile package.json -ua
	rm -rf node_modules
	yarn

update-data:
	$(NODE) oui.js update -w

patch:
	$(MAKE) update-data
	$(MAKE) lint
	$(MAKE) test
	cat $(WEBMIN) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i patch $(VERSION))/" > $(WEBMIN)
	cat $(WEB) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i patch $(VERSION))/" > $(WEB)
	$(MAKE) min
	npm version -f patch
	$(MAKE) publish

minor:
	$(MAKE) update-data
	$(MAKE) lint
	$(MAKE) test
	cat $(WEBMIN) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i minor $(VERSION))/" > $(WEBMIN)
	cat $(WEB) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i minor $(VERSION))/" > $(WEB)
	git diff --exit-code &>/dev/null || git commit -am "bump version"
	$(MAKE) min
	npm version -f minor
	$(MAKE) publish

major:
	$(MAKE) update-data
	$(MAKE) lint
	$(MAKE) test
	cat $(WEBMIN) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i major $(VERSION))/" > $(WEBMIN)
	cat $(WEB) | sed -E "s/v[0-9\.]+/v$$($(SEMVER) -i major $(VERSION))/" > $(WEB)
	git diff --exit-code &>/dev/null || git commit -am "bump version"
	$(MAKE) min
	npm version -f major
	$(MAKE) publish

.PHONY: lint test min publish update update-data patch minor major
