# InfoSec Innovations Sentinel Service Offering

We are building a library of useful templates to set up Microsoft Sentinel resources using ARM templates.

We have made use of https://github.com/OTRF/Blacksmith and https://github.com/OTRF/Microsoft-Sentinel2Go/ to find existing templates for some of the elements we wish to deploy. Some of our templates are modified versions of these, or in some cases we have even directly linked them because they do what we need.

InfoSec Innovations does not bear responsibility for the consequences of using this repository without our oversight, the files have mostly been made public for our own convenience, but you are free to use them without any expectation of support should any issues arise (unless you are one of our clients).

## Terminology and abbreviations

- LAW - Log Analytics Workspace

## Permissions

### Windows Security Events

Unlike the other Data Connectors, you only need Resource Group Contributor permissions to enable Security Events via AMA. However to onboard machines you will require a higher level (TODO: which?)

### Azure Activity

The Azure Activity Data Connector requires Subscription Owner permissions to enable

### Microsoft 365

The Microsoft 365 Data Connector requires Global Administrator or Security Administrator on the tenant to enable

### Microsoft Entra ID

Due to current limitations with the Azure API, it's not officially possible to enable the Microsoft Entra ID Data Connector through an ARM template. There is a workaround requiring ownership of the Tenant root scope, however we don't recommend you do this, so you should just enable it from the Azure Portal web UI (see below) until it becomes available via ARM templates.

However, if you really want to deploy the Data Connector programmatically, you will need to do the following:

#### Enabling Tenant root scope ownership

> [!CAUTION]
> We really don't recommend doing this, proceed at your own risks and perils!

- Have `Global Administrator` permissions.

- In the portal go to Microsoft Entra ID/Properties and enable _Access management for Azure resources_ and save the change.

- Do the following in PowerShell using the `Az` module to assign ownership of the tenant scope:

      #sign in to Azure from Powershell, this will redirect you to a webbrowser for authentication, if required
      Connect-AzAccount
    
      #get object Id of the current user (that is used above)
      $user = Get-AzADUser -UserPrincipalName (Get-AzContext).Account

      #assign Owner role at Tenant root scope ("/") as a User Access Administrator to current user
      New-AzRoleAssignment -Scope '/' -RoleDefinitionName 'Owner' -ObjectId $user.Id

## Install

The LAW name must be unique within the Resource Group.

We do not recommend attempting to instantiate our template multiple times within the same Resource Group.

### Single-click install

If you have permissions to install all the items you need (see [Permissions](#permissions) and [Installed Items](#installed-items)), just click the button!

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Feverything.json)

If you are unable to get the permissions required to do the full install yourself, you can complete the process below with the help of someone who can do so.

### Multi-step install

#### First template

Install a Sentinel enabled LAW and add the Data Connectors, see [Permissions](#permissions) above to figure out the requirements for each connector.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Fconfigure-workspace.json)

If you're not using Microsoft Entra ID, skip to the [Second template](#second-template)

#### Manually enabling Microsoft Entra ID Data Connector

See [Microsoft Entra ID](#microsoft-entra-id) above for information about this issue.

If you need the Entra ID Data Connector without having Tenant root scope Owner permissions, after installing the template using the button above:
- You will need read and write permissions to Microsoft Entra ID diagnostic settings and Global Administrator or Security Administrator on the tenant.
- Go to Microsoft Sentinel in the Azure Portal.
- Select the Log Analytics Workspace created by the template. If you didn't set a custom name during deployment it will be called `LAW-ISI-SentinelServiceOffering`.
- Go to the Data Connectors area.
- If you enabled Microsoft Entra ID in the deployment template, you should have a Data Connector available there called `Microsoft Entra ID`.
- Select it and click _Open connector page_.
- Make sure you meet the permissions requirements listed there.
- Enable the logs you wish to collect. TODO: ISI recommended list.

#### Second template

Now the LAW and Data Connectors are good to go, you can install the Workbooks and Log Analytics Rules.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Fworkspace-content.json)

## Known issues

- If you tear down a Sentinel instance and redeploy using the same Resource Group and LAW names you can get errors due to the deleted instance not having been completely removed yet.
- Sometimes the dependencies for the Analytics Rules won't exist yet and they will fail to validate. Take note of the ones that didn't deploy and try to enable them later. It is generally agreed upon by Sentinel users that enabling Analytics Rules can be a fiddly experience.

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
- Apache Log4j Vulnerability Detection Content Hub Package
  - Analytics Rules
    - Log4j vulnerability exploit aka Log4Shell IP IOC
    - User agent search for log4j exploitation attempt
    - Vulnerable Machines related to log4j CVE-2021-44228
- SecurityThreatEssentialSolution Content Hub Package
- Standalone
  - Workbooks
    - Archiving, Basic Logs and Retention Workbook
  - Analytics Rules
    - Advanced Multistage Attack Detection

### UEBA
- Standalone
  - Logging
    - Enable User and Entity Behaviour Analytics (UEBA) logs in the LAW
  - Workbooks
    - User And Entity Behavior Analytics Workbook

### Azure Activity

- Azure Activity Content Hub Package
  - Data Connectors
    - Enable Azure Activity Data Connector by setting up a diagnostic setting that sends activity logs to the LAW
  - Workbooks
    - Azure Activity Workbook
  - Analytics Rules
    - Creation of expensive computes in Azure
    - Suspicious number of resource creation or deployment activities
    - Suspicious granting of permissions to an account
- SecurityThreatEssentialSolution Content Hub Package
  - Analytics Rules
    - Threat Essentials - Mass Cloud resource deletions Time Series Anomaly

### Security Events

- Windows Security Events Content Hub Package
  - Data Connectors
    - Enable Windows Security Events via AMA Data Connector by creating a Data Collection Rule (DCR) using the profile selected in the template
    - (optional) add existing Arc Servers to the DCR after deploying it
  - Workbooks
    - Event Analyzer Workbook
  - Analytics Rules
    - New EXE deployed via Default Domain or Default Domain Controller Policies
    - Non Domain Controller Active Directory Replication
    - NRT Base64 Encoded Windows Process Command-lines
    - NRT Process executed from binary hidden in Base64 encoded file
    - NRT Security Event log cleared
    - Potential Fodhelper UAC Bypass
    - Potential re-named sdelete usage
    - Process Execution Frequency Anomaly
    - Scheduled Task Hide
    - Sdelete deployed via GPO and run recursively
    - SecurityEvent - Multiple authentication failures followed by a success
- Attacker Tools Threat Protection Essentials Content Hub Package
  - Analytics Rules
    - Credential Dumping Tools - File Artifacts
    - Credential Dumping Tools - Service Installation
    - Powershell Empire Cmdlets Executed in Command Line
- Standalone
  - Analytics Rules
    - (Preview) Anomalous RDP Login Detections


### Microsoft 365

If you use Microsoft 365 you should install this pack.

- Microsoft 365 Content Hub Package
  - Data Connectors
    - Microsoft 365 Data Connector
  - Workbooks
    - Exchange Online Workbook
    - Office 365 Workbook
  - Analytics Rules
    - Accessed files shared by temporary external user
    - Exchange AuditLog disabled
    - Malicious Inbox Rule
    - Multiple users email forwarded to same destination
    - New executable via Office FileUploaded Operation
    - Office policy tampering
    - Possible Forest Blizzard attempted credential harvesting - Sept 2020
    - Rare and potentially high-risk Office operations
    - SharePointFileOperation via devices with previously unseen user agents
    - SharePointFileOperation via previously unseen IPs
- SecurityThreatEssentialSolution Content Hub Package
  - Analytics Rules   
    - Mail redirect via ExO transport rule


### Microsoft Entra ID

If you use Microsoft Entra ID you should install this pack.

- Microsoft Entra ID Content Hub Package
  - Data Connectors
    - (optional, see [Microsoft Entra ID](#microsoft-entra-id) section above) Enable Microsoft Entra ID Data Connector by setting up a diagnostic setting that sends Microsoft Entra ID logs to the LAW
  - Analytics Rules
    - Account Created and Deleted in Short Timeframe
    - Admin promotion after Role Management Application Permission Grant
    - Anomalous sign-in location by user account and authenticating application
    - Attempts to sign in to disabled accounts
    - Authentication Methods Changed for Privileged Account
    - Azure Portal sign in from another Azure Tenant
    - Brute force attack against a Cloud PC
    - Brute force attack against Azure Portal
    - Bulk Changes to Privileged Account Permissions
    - Credential added after admin consented to Application
    - Cross-tenant Access Settings Organization Added
    - Distributed Password cracking attempts in Microsoft Entra ID
    - Explicit MFA Deny
    - External guest invitation followed by Microsoft Entra ID PowerShell signin
    - First access credential added to Application or Service Principal where no credential was present
    - full_access_as_app Granted To Application
    - Mail.Read Permissions Granted to Application
    - MFA Rejected by User
    - Microsoft Entra ID Role Management Permission Grant
    - New access credential added to Application or Service Principal
    - New onmicrosoft domain added to tenant
    - New User Assigned to Privileged Role
    - Privileged Accounts - Sign in Failure Spikes
    - Rare application consent
    - Sign-ins from IPs that attempt sign-ins to disabled accounts
    - Successful logon from IP and failure from a different IP
    - Suspicious application consent for offline access
    - Suspicious application consent similar to O365 Attack Toolkit
    - Suspicious application consent similar to PwnAuth
    - Suspicious Entra ID Joined Device Update
    - Suspicious Service Principal creation activity
    - Suspicious Sign In Followed by MFA Modification
    - User added to Microsoft Entra ID Privileged Groups
- Cloud Identity Threat Protection Essentials
  - Analytics Rules
    - Multi-Factor Authentication Disabled for a User
    - New External User Granted Admin Role
- SecurityThreatEssentialSolution Content Hub Package
  - Analytics Rules 
    - Possible AiTM Phishing Attempt Against Microsoft Entra ID
    - Threat Essentials - NRT User added to Microsoft Entra ID Privileged Groups
    - Threat Essentials - User Assigned Privileged Role
- Standalone
  - Workbooks
    - Azure AD Audit, Activity and Sign-in logs Workbook

## Other Deployment Options

I just want a clean Sentinel instance:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FInfoSecInnovations%2FSentinel-Service-Offering%2Fmain%2Farm-templates%2Fdeploy-sentinel.json)

## Help Us To Help You!

We have a couple of issues open on the Azure Feedback forums which would make this project run a lot more smoothly.

If you want to help us improve our Sentinel Offering, please vote on these:

- https://feedback.azure.com/d365community/idea/a6d9b5a3-d0f8-ee11-a73c-0022485313bb
- https://feedback.azure.com/d365community/idea/e2ee1016-70fd-ee11-a73c-6045bd77de95 

Thank you so much!
