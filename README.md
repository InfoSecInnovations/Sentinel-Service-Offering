# InfoSec Innovations Sentinel Service Offering

We are building a library of useful templates to set up Microsoft Sentinel resources using ARM templates.

We have made use of https://github.com/OTRF/Blacksmith and https://github.com/OTRF/Microsoft-Sentinel2Go/ to find existing templates for some of the elements we wish to deploy. Some of our templates are modified versions of these, or in some cases we have even directly linked them because they do what we need.

InfoSec Innovations does not bear responsibility for the consequences of using this repository without our oversight, the files have mostly been made public for our own convenience, but you are free to use them without any expectation of support should any issues arise (unless you are one of our clients).

## Terminology and abbreviations

- LAW - Log Analytics Workspace

## Requirements

_TODO: requirements to be able to deploy resource group and subscription level templates?_

Due to current limitations with the Azure API, it's not officially possible to enable the Azure Active Directory Data Connector through an ARM template. There is a workaround requiring ownership of the Tenant root scope, however in many cases you will not be granted this level of permission, so you should just enable it from the Azure Portal web UI until it becomes available via ARM templates.

However, if you really want to deploy the Data Connector programmatically, you will need to do the following:

- Have `Global Administrator` permissions.

- In the portal go to Azure Active Directory/Properties and enable _Access management for Azure resources_ and save the change.

- Do the following in PowerShell using the `Az` module to assign ownership of the tenant scope:

      #sign in to Azure from Powershell, this will redirect you to a webbrowser for authentication, if required
      Connect-AzAccount
    
      #get object Id of the current user (that is used above)
      $user = Get-AzADUser -UserPrincipalName (Get-AzContext).Account

      #assign Owner role at Tenant root scope ("/") as a User Access Administrator to current user
      New-AzRoleAssignment -Scope '/' -RoleDefinitionName 'Owner' -ObjectId $user.Id

## Install

Just click the button!

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Fisi-main.json)

The LAW name must be unique, if you wish to install multiple instances of this template you should make sure to set different names each time.

We do not recommend attempting to instantiate it multiple times within the same Resource Group.

### Manually enabling Azure Active Directory Data Connector

See [Requirements](#requirements) above for information about this issue.

If you need the AAD Data Connector without having Tenant root scope Owner permissions, after installing the template using the button above: 
- Go to Microsoft Sentinel in the Azure Portal.
- Select the Log Analytics Workspace created by the template. If you didn't set a custom name during deployment it will be called `LAW-ISI-SentinelServiceOffering`.
- Go to the Data Connectors area.
- If you enabled Azure Active Directory in the deployment template, you should have a Data Connector available there called `Azure Active Directory`.
- Select it and click _Open connector page_.
- Make sure you meet the permissions requirements listed there.
- Enable the logs you wish to collect. TODO: ISI recommended list.

## Have InfoSec Innovations take care of setting up your Sentinel instance

Is setting up or tuning Azure Sentinel by yourself a bit too overwhelming? Would you like to be able to rely on professional support if things don't go smoothly? Please get in touch with us to discuss becoming a client: https://www.infosecinnovations.com/.

## Installed items

We have grouped the items into "packs" based around a data source, as most of the items depend on a specific data source to function. We recommend you install all of these packs unless you don't have the feature they draw data from installed, the ones where that can be the case are marked as "optional" and can be toggled from the main template. All of the items are what we would consider the baseline set of "must-haves" to start working with Sentinel. Depending on your particular setup you will probably want to include additional items and possible custom content, see above if you would like our assistance with that.

### Main template

The main template will instantiate a Log Analytics Workspace (LAW) with Microsoft Sentinel enabled on it. You can choose to deploy it to an existing Resource Group or create a new one during deployment.

### Basics

Some items that work out of the box regardless of the configured Data Connectors.

- SOC Handbook Content Hub Package
  - Workbooks
    - Analytics Efficiency Workbook
    - AnomaliesVisulization Workbook (sic)
    - Incident overview Workbook
    - Microsoft Sentinel Cost Workbook
- Standalone
  - Workbooks
    - Archiving, Basic Logs and Retention Workbook

### Azure Activity

- Azure Activity Content Hub Package
  - Data Connectors
    - Enable Azure Activity Data Connector by setting up a diagnostic setting that sends activity logs to the LAW
  - Workbooks
    - Azure Activity Workbook

### Security Events

- Windows Security Events Content Hub Package
  - Data Connectors
    - Enable Windows Security Events via AMA Data Connector by creating a Data Collection Rule (DCR) using the profile selected in the template
    - (optional) add existing Arc Servers to the DCR after deploying it
  - Workbooks
    - Event Analyzer Workbook

### Office365 (optional)

- Microsoft 365 Content Hub Package
  - Data Connectors
    - Microsoft 365 Data Connector
  - Workbooks
    - Exchange Online Workbook
    - Office 365 Workbook
  - Analytics Rules
    - Accessed files shared by temporary external user
    - Malicious Inbox Rule
    - Rare and potentially high-risk Office operations
    - Possible Forest Blizzard attempted credential harvesting - Sept 2020
    - Exchange AuditLog disabled
    - Multiple users email forwarded to same destination
    - New executable via Office FileUploaded Operation
    - Office policy tampering
    - SharePointFileOperation via devices with previously unseen user agents
    - Mail redirect via ExO transport rule
    - SharePointFileOperation via previously unseen IPs

### Azure Active Directory (optional)

- Azure Active Directory Content Hub Package
  - Data Connectors
    - (optional, see [Requirements](#requirements) section above) Enable Azure Active Directory Data Connector by setting up a diagnostic setting that sends Azure Active Directory logs to the LAW
- Standalone
  - Logging
    - Enable User and Entity Behaviour Analytics (UEBA) logs in the LAW
  - Workbooks
    - Azure AD Audit, Activity and Sign-in logs Workbook
    - User And Entity Behavior Analytics Workbook



