# 2025-08-17

- Improve Material Tiles with fixed width/height, text and gradient colors mirroring prun/rprun and text shadow (by `Razenpok`) [#163](https://github.com/PRUNplanner/frontend/pull/163)

# 2025-08-13

- Fixed an issue where production building recipe selection did not take into account the buildings efficiency on revenue / day and roi metrics (by `lilbit-prun`)
- Add "Buy From CX" option for XIT Actions for FIO Burn (by `lilbit-prun`)
- Implement Resource ROI Overview [#130](https://github.com/PRUNplanner/frontend/issues/130)
- Fix a bug where plan changes would automatically retrigger habitation optimization calls to the backend [#157](https://github.com/PRUNplanner/frontend/issues/157)

# 2025-08-12

- Implement ROI Overview for production buildings and their recipes [#129](https://github.com/PRUNplanner/frontend/issues/129), enhance COGM with total profits and visitation frequency calculations
- Add style for material `HBC`
- Add type checking capability with `tsc` and `tsc:watch` commands using `vue-tsc` [#146](https://github.com/PRUNplanner/frontend/issues/146)
- Fixed an issue where deselecting materials on XIT Burn did not properly affect the calculated total weight and volume [#150](https://github.com/PRUNplanner/frontend/issues/150)
- Small color adjustments and row-wrapping

# 2025-08-11

- Add Help & Changelog page, listing most recent changes
- Implement COGM calculations and modal on plan active recipes, excluding ability to change ticker preferences for now [#27](https://github.com/PRUNplanner/frontend/issues/27)
- Fix Benten manufacturing faction bonus (by `lilbit-prun`) [#142](https://github.com/PRUNplanner/frontend/pull/142)

# 2025-08-10

- Add CX Data popover on material tiles [#140](https://github.com/PRUNplanner/frontend/issues/140)

# 2025-08-08

- Fix an issue where adding a recipe produces a lag due to gamedata wrappers being retriggered on MaterialTiles
- Reduces the usage of `watch` in favor of `computed` [#138](https://github.com/PRUNplanner/frontend/issues/137)

# 2028-08-07

- Implement HQ Upgrade Cost Calculator [#128](https://github.com/PRUNplanner/frontend/issues/128)

