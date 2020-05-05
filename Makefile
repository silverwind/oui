WEB := oui.web.js
WEBMIN := oui.web.min.js

test:
	yarn -s run eslint --color index.js update.js test.js
	yarn -s run jest --color

min:
	yarn -s run terser $(WEB) -o $(WEBMIN) --mangle --compress --unsafe --comments "/oui/"

publish:
	git push -u --tags origin master
	npm publish --access public

deps:
	rm -rf node_modules
	npm i

update:
	yarn -s run updates -u
	$(MAKE) deps

patch: test min
	yarn -s run versions -C patch $(WEB) $(WEBMIN)
	$(MAKE) publish

minor: test min
	yarn -s run versions -C minor $(WEB) $(WEBMIN)
	$(MAKE) publish

major: test min
	yarn -s run versions -C major $(WEB) $(WEBMIN)
	$(MAKE) publish

.PHONY: test min publish update patch minor major
