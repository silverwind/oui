WEB := oui.web.js
WEBMIN := oui.web.min.js

test:
	yarn -s run eslint index.js update.js test.js
	yarn -s run jest

min:
	yarn -s run terser $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

publish:
	git push -u --tags origin master
	npm publish

deps:
	rm -rf node_modules
	yarn

update:
	yarn -s run updates -u
	$(MAKE) deps

data:
	node oui.js update -w

patch: test min
	yarn -s run versions -C patch $(WEB) $(WEBMIN)
	$(MAKE) publish

minor: test min
	yarn -s run versions -C minor $(WEB) $(WEBMIN)
	$(MAKE) publish

major: test min
	yarn -s run versions -C major $(WEB) $(WEBMIN)
	$(MAKE) publish

.PHONY: test min publish update data patch minor major
