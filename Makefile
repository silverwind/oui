WEB := oui.web.js
WEBMIN := oui.web.min.js

node_modules: package-lock.json
	npm install --no-save
	@touch node_modules

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules
	npx eslint --color index.js update.js test.js

.PHONY: test
test: node_modules lint build
	npx jest

.PHONY: build
build: node_modules
	npx terser $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

.PHONY: publish
publish: node_modules
	git push -u --tags origin master
	npm publish

update: node_modules
	npx updates -cu
	rm package-lock.json
	npm install
	@touch node_modules

.PHONY: data
data: node_modules
	node oui.js update -w

.PHONY: patch
patch: node_modules test build
	npx versions -C patch $(WEB) $(WEBMIN)
	@$(MAKE) --no-print-directory publish

.PHONY: minor
minor: node_modules test build
	npx versions -C minor $(WEB) $(WEBMIN)
	@$(MAKE) --no-print-directory publish

.PHONY: major
major: node_modules test build
	npx versions -C major $(WEB) $(WEBMIN)
	@$(MAKE) --no-print-directory publish
