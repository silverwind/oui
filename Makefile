WEB := oui.web.js
WEBMIN := oui.web.min.js

test:
	npx eslint --color --quiet index.js update.js test.js
	node --trace-deprecation --throw-deprecation --trace-warnings test.js

min:
	npx terser $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

publish:
	git push -u --tags origin master
	npm publish

deps:
	rm -rf node_modules
	npm i

update:
	npx updates -u
	$(MAKE) deps

patch:
	$(MAKE) test
	$(MAKE) min
	npx ver patch $(WEB) $(WEBMIN)
	$(MAKE) publish

minor:
	$(MAKE) test
	$(MAKE) min
	npx ver minor $(WEB) $(WEBMIN)
	$(MAKE) publish

major:
	$(MAKE) test
	$(MAKE) min
	npx ver major $(WEB) $(WEBMIN)
	$(MAKE) publish

.PHONY: test min publish update patch minor major
