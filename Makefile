NODE_BIN := node
NPM_MOD_DIR := $(CURDIR)/node_modules
NPM_BIN := $(NPM_MOD_DIR)/.bin

SRC_DIR := $(CURDIR)/src
DIST_DIR := $(CURDIR)/__dist

PRETTIER_TARGET := '$(SRC_DIR)/**/*.{js,cjs,mjs,jsx,ts,tsx}'

.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


###########################
# Clean
###########################
.PHONY: clean
clean: __clean_dist ## Cleanup generated files

.PHONY: __clean_dist
__clean_dist:
	rm -rf $(DIST_DIR)


###########################
# Build
###########################
.PHONY: Build
build: __clean_dist ## Generate JS files.
	$(NPM_BIN)/tsc --outDir $(DIST_DIR)/


###########################
# Testing
###########################


###########################
# Tools
###########################
.PHONY: typecheck
typecheck: ## Check types statically by tsc.
	$(NPM_BIN)/tsc --noEmit

.PHONY: format
format: __format_js ## Format files.

.PHONY: __format_js
__format_js:
	$(NPM_BIN)/prettier --write $(PRETTIER_TARGET)

.PHONY: format_check
format_check: ## Check code formatiing.
	$(NPM_BIN)/prettier --check $(PRETTIER_TARGET)
