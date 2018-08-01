VERSION := $(shell jq -r .version < package.json)
WEB := oui.web.js
WEBMIN := oui.web.min.js

test:
	npx eslint --color --quiet index.js update.js test.js
	node --trace-deprecation --throw-deprecation --trace-warnings test.js

min:
	npx uglifyjs $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

publish:
	git push -u --tags origin master
	npm publish

update:
	npx updates -u
	rm -rf node_modules
	yarn

patch:
	$(MAKE) test
	$(eval VER := $(shell npx semver -i patch $(VERSION)))
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEBMIN)
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEB)
	sed -Ei 's#"version": "$(VERSION)"#"version": "$(VER)"#' package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

minor:
	$(MAKE) test
	$(eval VER := $(shell npx semver -i minor $(VERSION)))
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEBMIN)
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEB)
	sed -Ei 's#"version": "$(VERSION)"#"version": "$(VER)"#' package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

major:
	$(MAKE) test
	$(eval VER := $(shell npx semver -i major $(VERSION)))
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEBMIN)
	sed -Ei "s#v[0-9]+\.[0-9]+\.[0-9]+#v$(VER)#" $(WEB)
	sed -Ei 's#"version": "$(VERSION)"#"version": "$(VER)"#' package.json
	$(MAKE) min
	git commit -am "$(VER)"
	git tag -a "$(VER)" -m "$(VER)"
	$(MAKE) publish

.PHONY: test min publish update patch minor major
