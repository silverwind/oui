VERSION := $(shell jq -r .version < package.json)
WEB := oui.web.js
WEBMIN := oui.web.min.js
BIN := node_modules/.bin

test:
	$(BIN)/eslint --color --quiet index.js update.js test.js
	node --trace-deprecation --throw-deprecation --trace-warnings test.js

min:
	$(BIN)/uglifyjs $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

publish:
	git push -u --tags origin master
	npm publish

update:
	$(BIN)/updates -u
	rm -rf node_modules
	yarn

patch:
	$(MAKE) test
	$(eval VER := $(shell $(BIN)/semver -i patch $(VERSION)))
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEB)
	jq ". | .version = \"$(VER)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

minor:
	$(MAKE) test
	$(eval VER := $(shell $(BIN)/semver -i minor $(VERSION)))
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEB)
	jq ". | .version = \"$(VER)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

major:
	$(MAKE) test
	$(eval VER := $(shell $(BIN)/semver -i major $(VERSION)))
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEBMIN)
	sed -Ei "s/v[0-9]+\.[0-9]+\.[0-9]+/v$(VER)/" $(WEB)
	jq ". | .version = \"$(VER)\"" package.json | sponge package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

.PHONY: test min publish update patch minor major
