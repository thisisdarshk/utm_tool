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
| **Ad Group ID** | `{adgroupid}` | Unique numeric identifier for the ad group | Search, Display, Shopping, Video, Performance Max | `9876543210` |
| **Ad Group Name** | `{adgroupname}` | Name of the ad group as set in Google Ads | Search, Display, Shopping, Video, Performance Max | `Running_Shoes_Keywords` |

### Creative & Ad Information
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Creative ID** | `{creative}` | Unique identifier for the creative/ad | All campaign types | `567890123456` |
| **Final URL Suffix** | `{finalurlsuffix}` | The final URL suffix for the keyword, ad, or extension | All campaign types | `utm_content=ad_variant_a` |

### Keyword & Targeting
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Keyword** | `{keyword:default}` | The keyword that triggered the ad (requires default value) | Search campaigns | `{keyword:none}` → `running shoes` |
| **Match Type** | `{matchtype}` | The match type of the keyword that triggered the ad | Search campaigns | `e` (exact), `p` (phrase), `b` (broad) |
| **Target ID** | `{targetid}` | ID of the targeting criteria that triggered the ad | All campaign types | `kwd-123456789`, `aud-123456789` |

### Device & Location
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Device** | `{device}` | Type of device where the ad was clicked | All campaign types | `m` (mobile), `t` (tablet), `c` (computer) |
| **Device Model** | `{devicemodel}` | Specific device model | All campaign types | `iPhone`, `Samsung Galaxy S21` |
| **Location Interest** | `{loc_interest_ms}` | Geographic location ID of interest | All campaign types | `1023191` (New York) |
| **Physical Location** | `{loc_physical_ms}` | Geographic location ID where user was located | All campaign types | `1023191` (New York) |

### Network & Placement
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Network** | `{network}` | Where the ad was shown | All campaign types | `g` (Google), `s` (Search partners), `d` (Display), `y` (YouTube) |
| **Placement** | `{placement}` | Website or app where the ad appeared | Display, Video, Discovery, Performance Max | `youtube.com`, `example.com` |

### Essential Tracking
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Google Click ID** | `{gclid}` | Google Click Identifier for conversion tracking | All campaign types | `CjwKCAiA...` |
| **Feed Item ID** | `{feeditemid}` | ID of the specific ad extension that was clicked | All campaign types with extensions | `987654321` |

## Search Campaign Parameters

Specific to Google Search campaigns and keyword-based advertising.

### Keyword Details
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Keyword** | `{keyword:default_value}` | Keyword that triggered the ad | `{keyword:none}` | **Must include default value** |
| **Match Type** | `{matchtype}` | Keyword match type | `e`, `p`, `b` | e=exact, p=phrase, b=broad |
| **Query String** | `{querystring}` | Actual search query entered by user | `best running shoes 2025` | User's exact search |

### Search Performance
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Ad Position** | `{adposition}` | Position of the ad on the search results page | `1t2` (top position 2) | Format: position+location |
| **GCLID** | `{gclid}` | Google Click Identifier for conversion tracking | `CjwKCAiA...` | Essential for tracking |

## Shopping Campaign Parameters

Specific to Google Shopping campaigns and product advertising.

### Product Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Product ID** | `{productid}` | Product ID from your Merchant Center feed | `SKU123456` | From product feed |
| **Product Country** | `{productcountry}` | Country of sale for the product | `US`, `CA`, `GB` | ISO country codes |
| **Product Language** | `{productlanguage}` | Language of the product information | `en`, `es`, `fr` | ISO language codes |
| **Product Channel** | `{productchannel}` | Sales channel (online or local) | `online`, `local` | Channel type |
| **Merchant ID** | `{merchantid}` | Your Google Merchant Center ID | `123456789` | Merchant Center account |
| **Store Code** | `{storecode}` | Store identifier for local inventory ads | `STORE_NYC_001` | Local inventory only |

### Shopping Targeting
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Product Partition ID** | `{productpartitionid}` | ID of the product group | `123456789` | Product group structure |
| **Feed Item ID** | `{feeditemid}` | ID of the specific feed item | `987654321` | Individual product |

## Video Campaign Parameters (YouTube Ads)

Specific to YouTube and video advertising campaigns.

### Video Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Video ID** | `{videoid}` | YouTube video ID where the ad appeared | `dQw4w9WgXcQ` | YouTube video identifier |
| **Video Title** | `{videotitle}` | Title of the YouTube video | `How to Run Faster` | Video content title |
| **Channel ID** | `{channelid}` | YouTube channel ID where ad appeared | `UCxxxxxxxxxxxxxx` | YouTube channel |

### Video Targeting
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Placement** | `{placement}` | Specific YouTube channel or video | `youtube.com/channel/UC...` | Video placement |
| **Target ID** | `{targetid}` | Targeting criteria ID | `aud-123456789` | Audience targeting |

## Performance Max Campaign Parameters

Specific to Performance Max campaigns that run across all Google properties.

### Asset Group Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Asset Group ID** | `{assetgroupid}` | Unique identifier for the asset group | `456789123` | Asset group identifier |
| **Asset Group Name** | `{assetgroupname}` | Name of the asset group | `Summer_Assets_Group` | Asset group name |

### Cross-Network Tracking
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Network** | `{network}` | Google property where ad was shown | `g`, `s`, `d`, `y` | g=Google, s=Search partners, d=Display, y=YouTube |
| **Placement** | `{placement}` | Specific placement or property | `youtube.com`, `gmail.com` | Cross-network placement |

## Hotel Campaign Parameters

Specific to Google Hotel campaigns and travel advertising.

### Hotel Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Hotel ID** | `{hotelid}` | Unique identifier for the hotel | `12345` | Hotel property ID |
| **Hotel Name** | `{hotelname}` | Name of the hotel | `Grand_Plaza_Hotel` | Hotel property name |
| **Hotel Country** | `{hotelcountry}` | Country where the hotel is located | `US`, `FR`, `JP` | ISO country codes |
| **Hotel State** | `{hotelstate}` | State/region where hotel is located | `CA`, `NY`, `FL` | State/region codes |
| **Hotel City** | `{hotelcity}` | City where the hotel is located | `San_Francisco` | City name |

### Booking Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Check-in Date** | `{checkindate}` | Check-in date for the booking | `2025-07-15` | YYYY-MM-DD format |
| **Check-out Date** | `{checkoutdate}` | Check-out date for the booking | `2025-07-18` | YYYY-MM-DD format |
| **Length of Stay** | `{lengthofstay}` | Number of nights | `3` | Number of nights |
| **Number of Adults** | `{numberofadults}` | Number of adult guests | `2` | Guest count |
| **Partner ID** | `{partnerid}` | Hotel partner identifier | `partner123` | Partner system ID |

## App Campaign Parameters

Specific to Google App campaigns for mobile app promotion.

### App Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **App ID** | `{appid}` | Unique identifier for the mobile app | `com.example.app` | App package name |
| **App Store** | `{appstore}` | App store where the app is available | `googleplay`, `itunes` | Store identifier |
| **Campaign Sub Type** | `{campaignsubtype}` | Type of app campaign | `APP_INSTALLS`, `APP_ENGAGEMENT` | Campaign objective |

### App Targeting
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **OS Version** | `{osversion}` | Operating system version | `iOS_15`, `Android_12` | OS version |
| **App Version** | `{appversion}` | Version of the app being promoted | `2.1.0` | App version number |

## Local Campaign Parameters

Specific to Local campaigns promoting physical business locations.

### Location Information
| Parameter | Syntax | Description | Example Values | Notes |
|-----------|--------|-------------|----------------|-------|
| **Store Code** | `{storecode}` | Unique identifier for the business location | `STORE_SF_001` | Store identifier |
| **Location ID** | `{locationid}` | Google My Business location ID | `12345678901234567890` | GMB location ID |

## Conditional Parameters (If/Then Logic)

These parameters use conditional logic to insert different values based on specific conditions.

### Device Conditionals
| Parameter | Syntax | Description | Supported Campaigns | Usage Example |
|-----------|--------|-------------|-------------------|---------------|
| **If Mobile** | `{ifmobile:value}` | Inserts value if clicked on mobile device | All campaign types | `{ifmobile:mobile_user}` |
| **If Not Mobile** | `{ifnotmobile:value}` | Inserts value if NOT clicked on mobile device | All campaign types | `{ifnotmobile:desktop_user}` |

### Network Conditionals
| Parameter | Syntax | Description | Supported Campaigns | Usage Example |
|-----------|--------|-------------|-------------------|---------------|
| **If Search** | `{ifsearch:value}` | Inserts value if ad shown on Google Search | Search campaigns | `{ifsearch:search_traffic}` |
| **If Content** | `{ifcontent:value}` | Inserts value if ad shown on Display Network | Display campaigns | `{ifcontent:display_traffic}` |

### Campaign Type Conditionals
| Parameter | Syntax | Description | Supported Campaigns | Usage Example |
|-----------|--------|-------------|-------------------|---------------|
| **If Shopping** | `{ifshopping:value}` | Inserts value if Shopping campaign | Shopping campaigns | `{ifshopping:product_ad}` |

## Advanced Targeting Parameters

### Audience & Demographics
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Interest Category** | `{interestcategory}` | Interest category that triggered the ad | Display, Video, Discovery | `Sports/Fitness`, `Technology` |
| **Age** | `{age}` | Age range of the user | Display, Video | `25-34`, `35-44`, `45-54` |
| **Gender** | `{gender}` | Gender targeting | Display, Video | `m` (male), `f` (female), `u` (unknown) |

### Time & Date Parameters
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Hour** | `{hour}` | Hour when the ad was clicked (24-hour format) | All campaign types | `14` (2 PM), `09` (9 AM) |
| **Day of Week** | `{dayofweek}` | Day of the week when ad was clicked | All campaign types | `monday`, `tuesday`, `wednesday` |

## Landing Page & URL Parameters

### URL Construction
| Parameter | Syntax | Description | Example | Notes |
|-----------|--------|-------------|---------|-------|
| **Landing Page URL** | `{lpurl}` | The final URL of your ad (URL encoded) | `https://example.com/product` | **Most commonly used** |
| **Unescaped Landing Page URL** | `{lpurl+}` | Unescaped version of the landing page URL | `https://example.com/product?param=value` | Use when you need unescaped URLs |
| **Escaped Landing Page URL** | `{escapedlpurl}` | Double URL-encoded version of landing page URL | `https%253A//example.com/product` | For special encoding needs |

## Custom Parameters

### User-Defined Parameters
| Parameter | Syntax | Description | Supported Campaigns | Usage Example |
|-----------|--------|-------------|-------------------|---------------|
| **Custom Parameter** | `{_parametername}` | Custom parameter you define | All campaign types | `{_season}`, `{_promo}`, `{_source}` |

**Important Notes for Custom Parameters:**
- Must start with underscore (`_`)
- Can contain letters, numbers, and underscores only
- Maximum 16 characters after the underscore
- Case-sensitive
- Must be defined at account, campaign, ad group, or keyword level

### Advanced Tracking
| Parameter | Syntax | Description | Supported Campaigns | Example Values |
|-----------|--------|-------------|-------------------|----------------|
| **Experiment ID** | `{experimentid}` | A/B test experiment identifier | All campaign types | `exp_123456` |

## Deprecated Parameters (No Longer Supported)

### Removed in 2024
| Parameter | Status | Replacement | Notes |
|-----------|--------|-------------|-------|
| **{param1}** | ❌ Deprecated | Use custom parameters `{_custom}` | Removed January 2024 |
| **{param2}** | ❌ Deprecated | Use custom parameters `{_custom}` | Removed January 2024 |

### Removed in 2023
| **{random}** | ❌ Deprecated | Use `{gclid}` for unique tracking | Removed March 2023 |
| **{copy}** | ❌ Deprecated | Use `{creative}` | Removed June 2023 |

## Best Practices & Implementation Guidelines

### Essential Implementation Rules

1. **Always Use Default Values for Keywords**
   ```
   ✅ Correct: {keyword:none}
   ❌ Incorrect: {keyword}
   ```

2. **Proper URL Template Structure**
   ```
   {lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_term={keyword:none}&utm_content={creative}&gclid={gclid}
   ```

3. **URL Length Considerations**
   - Keep total URL under 2000 characters
   - Use shorter parameter names when possible
   - Consider URL shorteners for very long URLs

4. **Required vs Optional Parameters**
   - **Always include**: `{gclid}` for conversion tracking
   - **Highly recommended**: `{campaignid}`, `{adgroupid}`, `{creative}`
   - **Campaign-specific**: Use relevant parameters for your campaign type

### Common Implementation Patterns

#### Basic Search Campaign Template
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&utm_term={keyword:none}&utm_content={creative}&gclid={gclid}
```

#### Shopping Campaign Template
```
{lpurl}?utm_source=googleshopping&utm_medium=cpc&utm_campaign={campaignname}&utm_content={productid}&merchant_id={merchantid}&gclid={gclid}
```

#### Performance Max Campaign Template
```
{lpurl}?utm_source=google&utm_medium=pmax&utm_campaign={campaignname}&utm_content={assetgroupname}&network={network}&gclid={gclid}
```

#### Video Campaign Template
```
{lpurl}?utm_source=youtube&utm_medium=video&utm_campaign={campaignname}&utm_content={creative}&video_id={videoid}&gclid={gclid}
```

#### Display Campaign Template
```
{lpurl}?utm_source=google&utm_medium=display&utm_campaign={campaignname}&utm_content={creative}&placement={placement}&gclid={gclid}
```

### Advanced Conditional Logic Examples

#### Device-Specific Tracking
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&device_type={ifmobile:mobile}{ifnotmobile:desktop}&gclid={gclid}
```

#### Network-Specific Tracking
```
{lpurl}?utm_source=google&utm_medium={ifsearch:search}{ifcontent:display}&utm_campaign={campaignname}&gclid={gclid}
```

#### Multi-Conditional Example
```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignname}&device={device}&traffic_type={ifsearch:search}{ifcontent:display}{ifmobile:_mobile}&gclid={gclid}
```

## Recent Updates (2024-2025)

### New Parameters Added
- **Enhanced Asset Group tracking** for Performance Max campaigns
- **Improved device model detection** with more granular device information
- **Extended location targeting** with separate interest and physical location IDs
- **Advanced audience parameters** for better demographic tracking

### Parameter Changes
- **{keyword}** now strictly requires a default value in all implementations
- **{device}** values standardized across all campaign types
- **{network}** expanded to include YouTube (`y`) and other Google properties
- **Custom parameters** now limited to 16 characters and must start with underscore

### Functionality Improvements
- **Better conditional logic** with more reliable if/then parameter processing
- **Enhanced URL encoding** with `{lpurl}`, `{lpurl+}`, and `{escapedlpurl}` options
- **Improved cross-campaign compatibility** for parameters used across multiple campaign types

## Troubleshooting Common Issues

### Parameter Not Populating
1. **Check campaign type compatibility** - Ensure parameter is supported
2. **Verify syntax** - Confirm correct curly brace formatting
3. **Include default values** - Required for keyword and conditional parameters
4. **Test with different match types** - Some parameters vary by match type

### URL Length Issues
1. **Use shorter parameter names** where possible
2. **Combine related parameters** instead of using multiple separate ones
3. **Consider essential parameters only** for campaigns with many targeting options
4. **Use URL shorteners** as a last resort

### Tracking Template vs Final URL Suffix
- **Tracking Template**: Use at campaign/ad group level for consistent tracking
- **Final URL Suffix**: Use at keyword/ad level for specific tracking
- **Don't use both** for the same parameters to avoid duplication

## Testing & Validation

### Pre-Launch Checklist
- [ ] All required parameters have default values
- [ ] URL length is under 2000 characters
- [ ] Parameters are appropriate for campaign type
- [ ] Conditional logic is properly formatted
- [ ] GCLID is included for conversion tracking
- [ ] Custom parameters are properly defined

### Testing Methods
1. **Preview URLs** in Google Ads interface
2. **Test clicks** from different devices and networks
3. **Verify parameter population** in analytics platform
4. **Check URL encoding** doesn't break functionality
5. **Validate conditional logic** under different conditions

## Integration with Analytics Platforms

### Google Analytics 4 (GA4)
- Use standard UTM parameters for automatic channel grouping
- Configure custom dimensions for ValueTrack parameters
- Set up conversion tracking with GCLID

### Other Analytics Platforms
- Map ValueTrack parameters to custom dimensions
- Ensure proper URL decoding in your analytics setup
- Test parameter capture across different platforms

## Security & Privacy Considerations

### Data Handling
- **PII Compliance**: ValueTrack parameters don't contain personally identifiable information
- **GDPR Compliance**: Parameters are compliant with privacy regulations
- **Data Retention**: Follow your organization's data retention policies

### Best Practices
- **Avoid sensitive data** in custom parameters
- **Use hashed values** for internal identifiers when necessary
- **Regular audits** of parameter usage and data collection

---

*This reference guide is maintained to reflect the latest Google Ads features and best practices. For the most current information, always refer to the official Google Ads documentation.*