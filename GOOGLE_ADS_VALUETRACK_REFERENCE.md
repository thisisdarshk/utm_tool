# Google Ads ValueTrack Parameters - Comprehensive Reference Guide

*Last Updated: January 2025*

## Overview

ValueTrack parameters are dynamic URL parameters that Google Ads automatically populates with information about the click that brought a user to your website. These parameters help you track campaign performance and gather detailed analytics data.

## Universal Parameters (Most Campaign Types)

These parameters work across most Google Ads campaign types and provide fundamental tracking data.

### Campaign & Ad Group Information
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Campaign ID** | `{campaignid}` | Unique numeric identifier for the campaign | All campaign types | `1234567890` |
| **Campaign Name** | `{campaignname}` | Name of the campaign as set in Google Ads | All campaign types | `Summer_Sale_2025` |
| **Ad Group ID** | `{adgroupid}` | Unique numeric identifier for the ad group | Search, Display, Shopping, Video | `9876543210` |
| **Ad Group Name** | `{adgroupname}` | Name of the ad group as set in Google Ads | Search, Display, Shopping, Video | `Running_Shoes_Keywords` |

### Creative & Ad Information
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Creative ID** | `{creative}` | Unique identifier for the creative/ad | All campaign types | `567890123456` |
| **Final URL Suffix** | `{finalurlsuffix}` | The final URL suffix for the keyword, ad, or extension | All campaign types | `utm_content=ad_variant_a` |

### Keyword & Targeting
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Keyword** | `{keyword}` | The keyword that triggered the ad (requires default value) | Search campaigns | `running shoes` |
| **Match Type** | `{matchtype}` | The match type of the keyword that triggered the ad | Search campaigns | `e` (exact), `p` (phrase), `b` (broad) |
| **Target ID** | `{targetid}` | ID of the targeting criteria that triggered the ad | All campaign types | `kwd-123456789` |

### Device & Location
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Device** | `{device}` | Type of device where the ad was clicked | All campaign types | `m` (mobile), `t` (tablet), `c` (computer) |
| **Device Model** | `{devicemodel}` | Specific device model | All campaign types | `iPhone`, `Samsung Galaxy S21` |
| **Location ID** | `{loc_interest_ms}` | Geographic location ID of interest | All campaign types | `1023191` (New York) |
| **Physical Location** | `{loc_physical_ms}` | Geographic location ID where user was located | All campaign types | `1023191` (New York) |

### Network & Placement
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Network** | `{network}` | Where the ad was shown | All campaign types | `g` (Google), `s` (Search partners), `d` (Display) |
| **Placement** | `{placement}` | Website or app where the ad appeared | Display, Video, Discovery | `youtube.com`, `example.com` |

## Conditional Parameters (If/Then Logic)

These parameters use conditional logic to insert different values based on specific conditions.

### Device Conditionals
| Parameter | Syntax | Description | Supported Campaigns |
|-----------|--------|-------------|-------------------|
| **If Mobile** | `{ifmobile:value}` | Inserts value if clicked on mobile device | All campaign types |
| **If Not Mobile** | `{ifnotmobile:value}` | Inserts value if NOT clicked on mobile device | All campaign types |

### Network Conditionals
| Parameter | Syntax | Description | Supported Campaigns |
|-----------|--------|-------------|-------------------|
| **If Search** | `{ifsearch:value}` | Inserts value if ad shown on Google Search | Search campaigns |
| **If Content** | `{ifcontent:value}` | Inserts value if ad shown on Display Network | Display campaigns |

## Search Campaign Parameters

Specific to Google Search campaigns and keyword-based advertising.

### Keyword Details
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Keyword** | `{keyword:default_value}` | Keyword that triggered the ad (must include default) | `{keyword:none}` |
| **Match Type** | `{matchtype}` | Keyword match type | `e`, `p`, `b` |
| **Query String** | `{querystring}` | Actual search query entered by user | `best running shoes 2025` |

### Search Specific
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Ad Position** | `{adposition}` | Position of the ad on the search results page | `1t2` (top position 2) |
| **GCLID** | `{gclid}` | Google Click Identifier for conversion tracking | `CjwKCAiA...` |

## Shopping Campaign Parameters

Specific to Google Shopping campaigns and product advertising.

### Product Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Product ID** | `{productid}` | Product ID from your Merchant Center feed | `SKU123456` |
| **Product Country** | `{productcountry}` | Country of sale for the product | `US`, `CA`, `GB` |
| **Product Language** | `{productlanguage}` | Language of the product information | `en`, `es`, `fr` |
| **Product Channel** | `{productchannel}` | Sales channel (online or local) | `online`, `local` |
| **Merchant ID** | `{merchantid}` | Your Google Merchant Center ID | `123456789` |
| **Store Code** | `{storecode}` | Store identifier for local inventory ads | `STORE_NYC_001` |

### Shopping Targeting
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Product Partition ID** | `{productpartitionid}` | ID of the product group | `123456789` |
| **Feed Item ID** | `{feeditemid}` | ID of the specific feed item | `987654321` |

## Video Campaign Parameters (YouTube Ads)

Specific to YouTube and video advertising campaigns.

### Video Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Video ID** | `{videoid}` | YouTube video ID where the ad appeared | `dQw4w9WgXcQ` |
| **Video Title** | `{videotitle}` | Title of the YouTube video | `How to Run Faster` |
| **Channel ID** | `{channelid}` | YouTube channel ID where ad appeared | `UCxxxxxxxxxxxxxx` |

### Video Targeting
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Placement** | `{placement}` | Specific YouTube channel or video | `youtube.com/channel/UC...` |
| **Target ID** | `{targetid}` | Targeting criteria ID | `aud-123456789` |

## Hotel Campaign Parameters

Specific to Google Hotel campaigns and travel advertising.

### Hotel Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Hotel ID** | `{hotelid}` | Unique identifier for the hotel | `12345` |
| **Hotel Name** | `{hotelname}` | Name of the hotel | `Grand_Plaza_Hotel` |
| **Hotel Country** | `{hotelcountry}` | Country where the hotel is located | `US`, `FR`, `JP` |
| **Hotel State** | `{hotelstate}` | State/region where hotel is located | `CA`, `NY`, `FL` |
| **Hotel City** | `{hotelcity}` | City where the hotel is located | `San_Francisco` |

### Booking Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Check-in Date** | `{checkindate}` | Check-in date for the booking | `2025-07-15` |
| **Check-out Date** | `{checkoutdate}` | Check-out date for the booking | `2025-07-18` |
| **Length of Stay** | `{lengthofstay}` | Number of nights | `3` |
| **Number of Adults** | `{numberofadults}` | Number of adult guests | `2` |
| **Partner ID** | `{partnerid}` | Hotel partner identifier | `partner123` |

## Performance Max Campaign Parameters

Specific to Performance Max campaigns that run across all Google properties.

### Performance Max Specific
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Asset Group ID** | `{assetgroupid}` | Unique identifier for the asset group | `456789123` |
| **Asset Group Name** | `{assetgroupname}` | Name of the asset group | `Summer_Assets_Group` |
| **Campaign Sub Type** | `{campaignsubtype}` | Sub-type of Performance Max campaign | `PERFORMANCE_MAX` |

### Cross-Network Tracking
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Network** | `{network}` | Google property where ad was shown | `g` (Google), `s` (Search partners), `d` (Display), `y` (YouTube) |
| **Placement** | `{placement}` | Specific placement or property | `youtube.com`, `gmail.com` |

## App Campaign Parameters

Specific to Google App campaigns for mobile app promotion.

### App Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **App ID** | `{appid}` | Unique identifier for the mobile app | `com.example.app` |
| **App Store** | `{appstore}` | App store where the app is available | `googleplay`, `itunes` |
| **Campaign Sub Type** | `{campaignsubtype}` | Type of app campaign | `APP_INSTALLS`, `APP_ENGAGEMENT` |

### App Targeting
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **OS Version** | `{osversion}` | Operating system version | `iOS_15`, `Android_12` |
| **App Version** | `{appversion}` | Version of the app being promoted | `2.1.0` |

## Local Campaign Parameters

Specific to Local campaigns promoting physical business locations.

### Location Information
| Parameter | Syntax | Description | Example Values |
|-----------|--------|-------------|----------------|
| **Store Code** | `{storecode}` | Unique identifier for the business location | `STORE_SF_001` |
| **Location ID** | `{locationid}` | Google My Business location ID | `12345678901234567890` |

## Advanced Targeting Parameters

### Audience & Demographics
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Interest Category** | `{interestcategory}` | Interest category that triggered the ad | Display, Video, Discovery | `Sports/Fitness` |
| **Age** | `{age}` | Age range of the user | Display, Video | `25-34`, `35-44` |
| **Gender** | `{gender}` | Gender targeting | Display, Video | `m` (male), `f` (female) |

### Custom Parameters
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Custom Parameter** | `{_custom}` | Custom parameter you define | All campaign types | `{_season}`, `{_promo}` |
| **Experiment ID** | `{experimentid}` | A/B test experiment identifier | All campaign types | `exp_123456` |

## Conditional Logic Parameters

### Device Conditions
| Parameter | Syntax | Description | Use Case |
|-----------|--------|-------------|----------|
| **If Mobile** | `{ifmobile:mobile_value}` | Shows value only on mobile devices | Mobile-specific tracking |
| **If Not Mobile** | `{ifnotmobile:desktop_value}` | Shows value only on non-mobile devices | Desktop-specific tracking |

### Network Conditions
| Parameter | Syntax | Description | Use Case |
|-----------|--------|-------------|----------|
| **If Search** | `{ifsearch:search_value}` | Shows value only on Search Network | Search-specific tracking |
| **If Content** | `{ifcontent:display_value}` | Shows value only on Display Network | Display-specific tracking |

## Landing Page Parameters

### URL Construction
| Parameter | Syntax | Description | Example |
|-----------|--------|-------------|---------|
| **Landing Page URL** | `{lpurl}` | The final URL of your ad | `https://example.com/product` |
| **Unescaped Landing Page URL** | `{lpurl+}` | Unescaped version of the landing page URL | `https://example.com/product?param=value` |
| **Escaped Landing Page URL** | `{escapedlpurl}` | URL-encoded version of landing page URL | `https%3A//example.com/product` |

## Time & Date Parameters

### Temporal Tracking
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Hour** | `{hour}` | Hour when the ad was clicked (24-hour format) | All campaign types | `14` (2 PM) |
| **Day of Week** | `{dayofweek}` | Day of the week when ad was clicked | All campaign types | `monday`, `tuesday` |

## Deprecated Parameters

### No Longer Supported
| Parameter | Status | Replacement | Notes |
|-----------|--------|-------------|-------|
| **{param1}** | Deprecated | Use custom parameters `{_custom}` | Removed in 2024 |
| **{param2}** | Deprecated | Use custom parameters `{_custom}` | Removed in 2024 |
| **{random}** | Deprecated | Use `{gclid}` for unique tracking | Removed in 2023 |

## Best Practices

### Implementation Guidelines
1. **Always include default values** for parameters that might be empty (e.g., `{keyword:none}`)
2. **Use URL encoding** when necessary to prevent URL parsing issues
3. **Test thoroughly** across different campaign types and devices
4. **Keep URLs under 2000 characters** to avoid truncation
5. **Use meaningful default values** that help identify when parameters are unavailable

### Common Use Cases
- **Campaign Performance Tracking**: Use `{campaignid}`, `{adgroupid}`, `{creative}`
- **Keyword Analysis**: Use `{keyword}`, `{matchtype}`, `{querystring}`
- **Device Optimization**: Use `{device}`, `{devicemodel}`, conditional parameters
- **Geographic Analysis**: Use `{loc_interest_ms}`, `{loc_physical_ms}`
- **Cross-Network Attribution**: Use `{network}`, `{placement}`

### URL Template Examples

#### Basic Search Campaign
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_term={keyword:none}&utm_content={creative}&gclid={gclid}
```

#### Shopping Campaign
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_content={productid}&merchant_id={merchantid}&gclid={gclid}
```

#### Performance Max Campaign
```
{lpurl}?utm_source=google&utm_medium=pmax&utm_campaign={campaignname}&utm_content={assetgroupname}&network={network}&gclid={gclid}
```

#### Video Campaign
```
{lpurl}?utm_source=youtube&utm_medium=video&utm_campaign={campaignname}&utm_content={creative}&video_id={videoid}&gclid={gclid}
```

## Recent Updates (2024-2025)

### New Parameters
- **Asset Group parameters** for Performance Max campaigns
- **Enhanced device model tracking** with more granular device information
- **Improved location targeting** with separate interest and physical location IDs

### Deprecated Parameters
- **{param1} and {param2}** - Replaced with custom parameters
- **{random}** - Use {gclid} for unique click identification
- **Legacy placement parameters** - Consolidated into {placement}

### Changed Functionality
- **{keyword}** now requires a default value in all implementations
- **{device}** values updated to be more consistent across campaign types
- **{network}** values expanded to include YouTube and Discovery

## Implementation Notes

### Required Default Values
Some parameters require default values to prevent empty parameters:
- `{keyword:default_value}` - Always provide a default
- `{ifmobile:mobile_value}` - Conditional parameters need values
- `{querystring:no_query}` - Recommended for search campaigns

### URL Encoding Considerations
- Use `{lpurl}` for most cases (automatically encoded)
- Use `{lpurl+}` when you need unescaped URLs
- Use `{escapedlpurl}` for double-encoding scenarios

### Testing Recommendations
1. Test across all device types (mobile, tablet, desktop)
2. Verify parameters populate correctly in different campaign types
3. Check URL length doesn't exceed browser limits
4. Validate that analytics platforms receive the data correctly
5. Test conditional parameters under different conditions