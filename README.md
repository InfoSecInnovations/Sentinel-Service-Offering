# InfoSec Innovations Sentinel Service Offering

We are building a library of useful templates to set up Microsoft Sentinel resources using ARM templates.

We have made use of https://github.com/OTRF/Blacksmith and https://github.com/OTRF/Microsoft-Sentinel2Go/ to find existing templates for some of the elements we wish to deploy. Some of our templates are modified versions of these, or in some cases we have even directly linked them because they do what we need.

InfoSec Innovations does not bear responsibility for the consequences of using this repository without our oversight, the files have mostly been made public for our own convenience, but you are free to use them without any expectation of support should any issues arise (unless you are one of our clients).

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Fisi-main.json)

## Have InfoSec Innovations take care of setting up your Sentinel instance

Is setting up or tuning Azure Sentinel by yourself a bit too overwhelming? Would you like to be able to rely on professional support if things don't go smoothly? Please get in touch with us to discuss becoming a client: https://www.infosecinnovations.com/.

## Installed items

We have grouped the items into "packs" based around a data source, as most of the items depend on a specific data source to function. We recommend you install all of these packs unless you don't have the feature they draw data from installed, the ones where that can be the case are marked as "optional" and can be toggled from the main template. All of the items are what we would consider the baseline set of "must-haves" to start working with Sentinel. Depending on your particular setup you will probably want to include additional items and possible custom content. 

### Main template

The main template will instantiate a Log Analytics Workspace (LAW) with Microsoft Sentinel enabled on it. You can choose to deploy it to an existing Resource Group or create a new one during deployment.

### Basics

Some items that work out of the box regardless of the configured Data Connectors.

- SOC Handbook Content Hub Package
  - Analytics Efficiency Workbook
  - AnomaliesVisulization Workbook (sic)
  - Incident overview Workbook
  - Microsoft Sentinel Cost Workbook
- Archiving, Basic Logs and Retention Workbook (standalone)

### Azure Activity

- Azure Activity Content Hub Package
  - Enable Azure Activity Data Connector by setting up a diagnostic setting that sends activity logs to the LAW
  - Azure Activity Workbook

### Security Events

- Windows Security Events Content Hub Package
  - Enable Windows Security Events via AMA Data Connector by creating a Data Collection Rule (DCR) using the profile selected in the template
  - (optional) add existing Arc Servers to the DCR after deploying it
  - Event Analyzer Workbook

### Office365 (optional)

- Microsoft 365 Content Hub Package
  - Microsoft 365 Data Connector
  - Exchange Online Workbook
  - Office 365 Workbook

### Azure Active Directory (optional)

- Azure Active Directory Content Hub Package
  - Enable Azure Active Directory Data Connector by setting up a diagnostic setting that sends Azure Active Directory logs to the LAW
- Azure AD Audit, Activity and Sign-in logs Workbook (standalone)
- User And Entity Behavior Analytics Workbook (standalone)

## Requirements

If using the Azure Active Directory pack you will need the correct permission to deploy to the tenant scope, this may be disabled by default. To configure these options your account will need to have `Global Administrator` permissions.

- In the portal go to Azure Active Directory/Properties and enable _Access management for Azure resources_

- Do the following in PowerShell using the `Az` module to assign ownership of the tenant scope:

      #sign in to Azure from Powershell, this will redirect you to a webbrowser for authentication, if required
      Connect-AzAccount
    
      #get object Id of the current user (that is used above)
      $user = Get-AzADUser -UserPrincipalName (Get-AzContext).Account

      #assign Owner role at Tenant root scope ("/") as a User Access Administrator to current user
      New-AzRoleAssignment -Scope '/' -RoleDefinitionName 'Owner' -ObjectId $user.Id

