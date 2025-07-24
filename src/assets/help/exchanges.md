# Priorities

The CX & Pricing Preferences to identify the price used for calculations are checked in the following order:

- Planet Material-based
- Empire Material-based
- Planet CX-based
- Empire CX-based
- Fallback: PP30 Day Universe Price

# Types

Preferences can be set with the types **BUY**, **SELL** or **BOTH** and will be used for either consumed, produced or both types.

If only a specific type is set, but the materials price should be calculated for another, higher preferences will supersede of fall back to 0 if none is available.

# Examples

1: The price for LST should be used. You have no Material-based setting for Limestone defined. Therefore the Planets CX preference is applied. If no such preference exists, the Empire CX preference is used. As you have both a Planet and Empire CX preference defined the Planet CX preference will supersede your Empire CX preference.

2: The price for NS should be used. You have an Material-based setting for NS on the Empire level, additionally you've set your preference Material-based on the Planet that should be calculated. The Planet Material-based preference for NS will supersede your Empire Material-based definition. As there is a Material-based definition available no CX-based preference will be applied.

3: The price for BBH should be used. You have not set any Material-based or CX-based preferences. The price for BBH therefore is calculated with 0.
