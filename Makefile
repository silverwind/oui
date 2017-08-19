VERSION := $(shell jq -r .version < package.json)
WEB := oui.web.js
WEBMIN := oui.web.min.js
NODE := node --trace-deprecation --throw-deprecation
ESLINT := node_modules/.bin/eslint
UGLIFY := node_modules/.bin/uglifyjs
NCU := node_modules/.bin/ncu
SEMVER := node_modules/.bin/semver

PATCH := $(shell $(SEMVER) -i patch $(VERSION))
MINOR := $(shell $(SEMVER) -i minor $(VERSION))
MAJOR := $(shell $(SEMVER) -i major $(VERSION))

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
	$(MAKE) test
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(PATCH)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(PATCH)/" $(WEB)
	jq ". | .version = \"$(PATCH)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(PATCH)"
	git tag -a "$(PATCH)" -m "$(PATCH)"
	$(MAKE) publish

minor:
	$(MAKE) update-data
	$(MAKE) test
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(MINOR)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(MINOR)/" $(WEB)
	jq ". | .version = \"$(MINOR)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(MINOR)"
	git tag -a "$(MINOR)" -m "$(MINOR)"
	$(MAKE) publish

major:
	$(MAKE) update-data
	$(MAKE) test
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(MAJOR)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(MAJOR)/" $(WEB)
	jq ". | .version = \"$(MAJOR)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(MAJOR)"
	git tag -a "$(MAJOR)" -m "$(MAJOR)"
	$(MAKE) publish

.PHONY: lint test min publish update update-data patch minor major
