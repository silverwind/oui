node_modules: package-lock.json
	npm install --no-save
	@touch node_modules

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules
	npx eslint --color index.js update.js test.js

.PHONY: test
test: node_modules lint
	npx jest

.PHONY: publish
publish: node_modules
	git push -u --tags origin master
	npm publish

update: node_modules
	npx updates -cu
	rm -rf node_modules package-lock.json
	npm install
	@touch node_modules

.PHONY: data
data: node_modules
	node oui.js update -w

.PHONY: patch
patch: node_modules test
	npx versions -C patch
	@$(MAKE) --no-print-directory publish

.PHONY: minor
minor: node_modules test
	npx versions -C minor
	@$(MAKE) --no-print-directory publish

.PHONY: major
major: node_modules test
	npx versions -C major
	@$(MAKE) --no-print-directory publish
