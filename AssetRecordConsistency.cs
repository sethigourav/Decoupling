using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using Topaz.Domain.DataModels;

namespace Topaz.Domain.Concrete.Systems.Multi
{
    public class AssetRecordConsistency
    {
#warning fix me
        protected static readonly int pageAssetLimit = 5000; // TODO FIX ME SHOULD BE AT LEAST 5K IS AT 100 FOR TESTING

        protected static readonly double badAssetConsistencyThreshold = 0.6;
        protected static readonly double goodAssetConsistencyThreshold = 0.9;

#warning remove some selecitons
        protected static readonly string SELECTIONS = @"Assets.Model as AssetModel, Assets.Manufacturer as AssetManufacturer, AssetRecordDetail.*, SimonAssets.*, CmisAssets.*, SimonEfbi.*, 
                        Assets.BU as AssetBU, Assets.Home as AssetHome, Assets.Department as AssetDepartment, Assets.Building as AssetBuilding, Assets.Custodian as AssetCustodian, Assets.PropertyStatus as AssetStatus,
                        (case when SimonAssets.EQUIP_ID is not null then 1 else 0 end) as ContainsSimon, SimonAssets.BU as SimonBU, SimonAssets.Home as SimonHome, SimonAssets.DeptId as SimonDepartment, SimonAssets.Inuse_Building as SimonBuilding, SimonAssets.Current_Custodian as SimonCustodian, SimonAssets.In_Service as SimonStatus,
                        (case when CmisAssets.CONTROL_NUMBER is not null then 1 else 0 end) as ContainsCmis, CmisAssets.BU as CmisBU, CmisAssets.Home as CmisHome, CmisAssets.Department as CmisDepartment, CmisAssets.Location_Building as CmisBuilding, CmisAssets.Org_Custodian as CmisCustodian, CmisAssets.Status_Asset as CmisStatus,
                        (case when SimonEfbi.asset_id is not null then 1 else 0 end) as ContainsSimonEfbi, SimonEfbi.Business_unit as SimonEfbiBU, SimonEfbi.Home_location_cd7 as SimonEfbiHome, SimonEfbi.DeptId as SimonEfbiDepartment, SimonEfbi.Building as SimonEfbiBuilding, SimonEfbi.Asset_status as SimonEfbiStatus,
                        (case when AssetSmartAssets.asset_id is not null then 1 else 0 end) as ContainsAssetSmart, AssetSmartassets.abu as AssetSmartBU, (case when dept_code is not null and len(dept_code) >= 2 then substring(dept_code, 1, 2) else '(unknown)' end) as AssetSmartHome, (case when dept_code is not null and len(dept_code) >= 2 then substring(dept_code, 3, len(dept_code) - 2) else '(unknown)' end) as AssetSmartDepartment, AssetSmartAssets.bldg as AssetSmartBuilding, AssetSmartAssets.custodian AssetSmartCustodian, AssetSmartAssets.status as AssetSmartStatus,
                        (case when MaximoAssets.ASSETID_BestKnown is not null then 1 else 0 end) as ContainsMaximo, MaximoAssets.Organization as MaximoOrganization, MaximoAssets.Location as MaximoBuilding, '' as MaximoCustodian, MaximoAssets.Status as MaximoStatus,
                        (case when LEN(MaximoAssets.Organization) >= 2 then LEFT(MaximoAssets.Organization, 2) else '(unknown)' end) as MaximoBU,
                        (case when LEN(MaximoAssets.Organization) >= 5 then SUBSTRING(MaximoAssets.Organization, 4, 2) else '(unknown)' end) as MaximoHome,
                        (case when LEN(MaximoAssets.Organization) >= 10 then SUBSTRING(MaximoAssets.Organization, 7, 4) else '(unknown)' end) as MaximoDepartment,
                        (case when CribA.SERIALID is not null or CribB.SERIALID is not null then 1 else 0 end) as ContainsCribmaster,
                        (case when CribA.SERIALID is null then CribB.BU_BestKnown         else CribA.BU_BestKnown         end) as CribmasterBU,
                        (case when CribA.SERIALID is null then CribB.Home_BestKnown       else CribA.BU_BestKnown         end) as CribmasterHome,
                        (case when CribA.SERIALID is null then CribB.Department_BestKnown else CribA.Department_BestKnown end) as CribmasterDepartment,
                        (case when CribA.SERIALID is null then CribB.Building_BestKnown   else CribA.Building_BestKnown   end) as CribmasterBuilding,
                        (case when CribA.SERIALID is null then CribB.Custodian_BestKnown  else CribA.Custodian_BestKnown  end) as CribmasterCustodian,
                        (case when CribA.SERIALID is null then CribB.STATUSDESC           else CribA.STATUSDESC           end) as CribmasterStatus,
                        AsmesBUTransform as AssetSmartBUTransform, AsmesHomeTransform as AssetSmartHomeTransform, AsmesDepartmentTransform as AssetSmartDepartmentTransform, AsmesOrganizationValid as AssetSmartOrganizationValid, AsmesBuildingTransform as AssetSmartBuildingTransform, AsmesLocationValid as AssetSmartLocationValid, AsmesCustodianTransform as AssetSmartCustodianTransform, AsmesCustodianValid as AssetSmartCustodianValid, AsmesPropertyStatusTransform as AssetSmartPropertyStatusTransform, AsmesPropertyStatusValid as AssetSmartPropertyStatusValid";

        public static void ExportRawData(OrganizationSelection organization, LocationSelection location, EmployeeSelection employee, TopazRequest request)
        {

            string employeeJoin;
            string whereClause;
            string[] parameters;
            string[] values;
            Topaz.Domain.Concrete.Dashboards.Assets.Inventory.SetBigAssetQueryData(organization, location, employee, request, out employeeJoin, out whereClause, out parameters, out values);

            string query = string.Format(
                @"select top {2} Assets.AssetId, Assets.Manufacturer, Assets.Model, Assets.SerialNo,
                        SimonBUTransform, SimonHomeTransform, SimonDepartmentTransform, SimonOrganizationValid, SimonBuildingTransform, SimonLocationValid, SimonCustodianTransform, SimonCustodianValid, SimonPropertyStatusTransform, SimonPropertyStatusValid,
                        CmisBUTransform, CmisHomeTransform, CmisDepartmentTransform, CmisOrganizationValid, CmisBuildingTransform, CmisLocationValid, CmisCustodianTransform, CmisCustodianValid, CmisPropertyStatusTransform, CmisPropertyStatusValid,
                        GoldBUTransform, GoldHomeTransform, GoldDepartmentTransform, GoldOrganizationValid, GoldBuildingTransform, GoldLocationValid, GoldCustodianTransform, GoldCustodianValid, GoldPropertyStatusTransform, GoldPropertyStatusValid,
                        AsmesBUTransform as AssetSmartBUTransform, AsmesHomeTransform as AssetSmartHomeTransform, AsmesDepartmentTransform as AssetSmartDepartmentTransform, AsmesOrganizationValid as AssetSmartOrganizationValid, AsmesBuildingTransform as AssetSmartBuildingTransform, AsmesLocationValid as AssetSmartLocationValid, AsmesCustodianTransform as AssetSmartCustodianTransform, AsmesCustodianValid as AssetSmartCustodianValid, AsmesPropertyStatusTransform as AssetSmartPropertyStatusTransform, AsmesPropertyStatusValid as AssetSmartPropertyStatusValid,
                        CribmasterBUTransform as CribmasterBUTransform, CribmasterHomeTransform as CribmasterHomeTransform, CribmasterDepartmentTransform as CribmasterDepartmentTransform, CribmasterOrganizationValid as CribmasterOrganizationValid, CribmasterBuildingTransform as CribmasterBuildingTransform, CribmasterLocationValid as CribmasterLocationValid, CribmasterCustodianTransform as CribmasterCustodianTransform, CribmasterCustodianValid as CribmasterCustodianValid, CribmasterPropertyStatusTransform as CribmasterPropertyStatusTransform, CribmasterPropertyStatusValid as CribmasterPropertyStatusValid,
                        SimonEfbiBUTransform as EasBUTransform, SimonEfbiHomeTransform as EasHomeTransform, SimonEfbiDepartmentTransform as EasDepartmentTransform, SimonEfbiOrganizationValid as EasOrganizationValid, SimonEfbiBuildingTransform as EasBuildingTransform, SimonEfbiLocationValid as EasLocationValid, SimonEfbiPropertyStatusTransform as EasPropertyStatusTransform, SimonEfbiPropertyStatusValid as EasPropertyStatusValid,
                        MaximoBUTransform as MaximoBUTransform, MaximoHomeTransform as MaximoHomeTransform, MaximoDepartmentTransform as MaximoDepartmentTransform, MaximoOrganizationValid as MaximoOrganizationValid, MaximoBuildingTransform as MaximoBuildingTransform, MaximoLocationValid as MaximoLocationValid, MaximoPropertyStatusTransform as MaximoPropertyStatusTransform, MaximoPropertyStatusValid as MaximoPropertyStatusValid,
                        SystemRecordConsistency,
                        Organizations.*, Locations.*
		            from Assets
                    inner join Organizations on Organizations.BU = [Assets].BU and Organizations.Home = [Assets].Home and Organizations.Department = [Assets].Department
                    inner join Locations on Locations.Building = [Assets].Building
                    inner join AssetRecordDetail on AssetRecordDetail.AssetId=Assets.AssetId
                    {1}
                    where 1=1 {0} ", whereClause, employeeJoin, pageAssetLimit);

            DataTable data = TopazDatabaseUtilities.DataTableFromQuery(query, "Topaz", parameters, values);
            string[] columns = { "AssetId", "Manufacturer", "Model", "SerialNo",
                "SimonBUTransform", "SimonHomeTransform", "SimonDepartmentTransform", "SimonOrganizationValid", "SimonBuildingTransform", "SimonLocationValid", "SimonCustodianTransform", "SimonCustodianValid", "SimonPropertyStatusTransform", "SimonPropertyStatusValid",
                "CmisBUTransform", "CmisHomeTransform", "CmisDepartmentTransform", "CmisOrganizationValid", "CmisBuildingTransform", "CmisLocationValid", "CmisCustodianTransform", "CmisCustodianValid", "CmisPropertyStatusTransform", "CmisPropertyStatusValid",
                "GoldBUTransform", "GoldHomeTransform", "GoldDepartmentTransform", "GoldOrganizationValid", "GoldBuildingTransform", "GoldLocationValid", "GoldCustodianTransform", "GoldCustodianValid", "GoldPropertyStatusTransform", "GoldPropertyStatusValid",
                "AssetSmartBUTransform", "AssetSmartHomeTransform", "AssetSmartDepartmentTransform", "AssetSmartOrganizationValid", "AssetSmartBuildingTransform", "AssetSmartLocationValid", "AssetSmartCustodianTransform", "AssetSmartCustodianValid", "AssetSmartPropertyStatusTransform", "AssetSmartPropertyStatusValid",
                "CribmasterBUTransform", "CribmasterHomeTransform", "CribmasterDepartmentTransform", "CribmasterOrganizationValid", "CribmasterBuildingTransform", "CribmasterLocationValid", "CribmasterCustodianTransform", "CribmasterCustodianValid", "CribmasterPropertyStatusTransform", "CribmasterPropertyStatusValid",
                "EasBUTransform", "EasHomeTransform", "EasDepartmentTransform", "EasOrganizationValid", "EasBuildingTransform", "EasLocationValid", "EasPropertyStatusTransform", "EasPropertyStatusValid",
                "MaximoBUTransform", "MaximoHomeTransform", "MaximoDepartmentTransform", "MaximoOrganizationValid", "MaximoBuildingTransform", "MaximoLocationValid", "MaximoPropertyStatusTransform", "MaximoPropertyStatusValid",
                "SystemRecordConsistency"};

            TopazDataTableUtilities.ExportRawData(data, columns, organization, showCustodian: false);
        }

        public static string SelectionData(HierarchicalSelection selection, TopazRequest request)
        {
            string assetID = TopazDatabaseUtilities.Coalesce(request["AssetID"], "");
            string serialNo = TopazDatabaseUtilities.Coalesce(request["SerialNo"], "");
            string modelNo = TopazDatabaseUtilities.Coalesce(request["ModelNo"], "");
            string modelDesc = TopazDatabaseUtilities.Coalesce(request["ModelDesc"], "");
            string manufacturer = TopazDatabaseUtilities.Coalesce(request["Manufacturer"], "");

            bool manufacturerExact, modelNoExact, modelDescExact, assetIdExact;

            Boolean.TryParse(TopazDatabaseUtilities.Coalesce(request["ManufacturerExact"], "false"), out manufacturerExact);
            Boolean.TryParse(TopazDatabaseUtilities.Coalesce(request["ModelNoExact"], "false"), out modelNoExact);
            Boolean.TryParse(TopazDatabaseUtilities.Coalesce(request["ModelDescExact"], "false"), out modelDescExact);
            Boolean.TryParse(TopazDatabaseUtilities.Coalesce(request["AssetIDExact"], "true"), out assetIdExact);

            double minWeight, maxWeight;

            minWeight = double.TryParse(TopazDatabaseUtilities.Coalesce(request["MinWeight"], ""), out minWeight) ? minWeight : -1;
            maxWeight = double.TryParse(TopazDatabaseUtilities.Coalesce(request["MaxWeight"], ""), out maxWeight) ? maxWeight : -1;

            string assetIdWildcard = Topaz.Domain.Concrete.Dashboards.Assets.Inventory.WildcardStringIfChecked(assetIdExact, assetID.Length > 0);
            string modelNoWildcard = Topaz.Domain.Concrete.Dashboards.Assets.Inventory.WildcardStringIfChecked(modelNoExact, modelNo.Length > 0);
            string modelDescWildcard = Topaz.Domain.Concrete.Dashboards.Assets.Inventory.WildcardStringIfChecked(modelDescExact, modelDesc.Length > 0);
            string manufacturerWildcard = Topaz.Domain.Concrete.Dashboards.Assets.Inventory.WildcardStringIfChecked(manufacturerExact, manufacturer.Length > 0);

            string assetIDArgument = assetIdWildcard + TopazUtility.SanitizeAssetId(assetID.ToUpper()) + assetIdWildcard;
            string serialNoArgument = TopazUtility.SanitizeAssetId(serialNo.ToUpper());
            string modelNoArgument = modelNoWildcard + TopazUtility.SanitizeModelNo(modelNo.ToUpper()) + modelNoWildcard;
            string modelDescArgument = modelDescWildcard + modelDesc + modelDescWildcard;
            string manufacturerArgument = manufacturerWildcard + manufacturer.ToUpper() + manufacturerWildcard;

            string weightWhereClause = minWeight >= 0 && maxWeight >= minWeight ? " and @MinWeight <= [Assets].Weight and @MaxWeight >= [Assets].Weight " : "";

            string altWhere = assetID.Length > 0 ? string.Format(" and {0} ", TopazUtility.GenerateWildcardQueryConstraint("AssetId", true, assetIdExact, "[Assets]", prefix: "")) : "";

            //employeeJoin = employee.WhereClause.Length > 0 ? " left join Employees on Assets.Custodian=Employees.BemsId " : " ";

            string joins = string.Format(@" inner join [Organizations] on Organizations.BU = [Assets].BU and Organizations.Home = [Assets].Home and Organizations.Department = [Assets].Department
                left join [Locations] on Locations.Building = [Assets].Building ");

            string whereClause = string.Format(" {0} {1} {2} {3} {4} {5}",
                    altWhere, TopazUtility.GenerateWildcardQueryConstraint("SerialNo", serialNo.Length > 0),
                    TopazUtility.GenerateWildcardQueryConstraint("Model", modelNo.Length > 0, modelNoExact), TopazUtility.GenerateWildcardQueryConstraint("Noun", modelDesc.Length > 0, modelDescExact), TopazUtility.GenerateWildcardQueryConstraint("Manufacturer", manufacturer.Length > 0, manufacturerExact),
                    weightWhereClause);

            DataTable altAssetId = TopazDatabaseUtilities.DataTableFromQuery("SELECT AssetId FROM AssetAlternateIds WHERE [AssetAlternateIds].AltAssetId = @AltAssetId", "Topaz", new string[] { "@AltAssetId" }, new object[] { assetID });

            if (altAssetId.Rows.Count > 0)
            {
                assetID = altAssetId.Rows[0].Field<string>("AssetId");
            }

            string[] parameters = new string[] { "@AssetId", "@AltAssetId", "@SerialNo", "@Model", "@Noun", "@Manufacturer", "@MinWeight", "@MaxWeight" };
            string[] values = new string[] { assetIDArgument, assetID, serialNoArgument, modelNoArgument, modelDescArgument, manufacturerArgument, minWeight >= 0 ? minWeight.ToString() : "", maxWeight >= minWeight ? maxWeight.ToString() : "" };

            parameters = TopazDatabaseUtilities.RemoveWhere<string, string>(x => x.Length == 0, values, parameters);
            values = TopazDatabaseUtilities.RemoveWhere<string>(x => x.Length == 0, values);

            string sumQuery = string.Format(@"SELECT
                COALESCE(SUM(CASE WHEN (SystemRecordConsistency < {0}) THEN 1 ELSE 0 END), 0) as [<{2}%],
                COALESCE(SUM(CASE WHEN (SystemRecordConsistency >= {0} AND SystemRecordConsistency <= {1}) THEN 1 ELSE 0 END), 0) as [{2}-{3}%],
                COALESCE(SUM(CASE WHEN (SystemRecordConsistency > {1}) THEN 1 ELSE 0 END), 0) as [>{3}%] FROM AssetRecordDetail
                INNER JOIN Assets on Assets.AssetId=AssetRecordDetail.assetid", badAssetConsistencyThreshold, goodAssetConsistencyThreshold, (int)(badAssetConsistencyThreshold * 100), (int)(goodAssetConsistencyThreshold * 100));

            var subData = selection.GetAllSubData(sumQuery, alias: "Assets", dataWhereClause: "1=1 " + whereClause, parameters: parameters, values: values);

            string jsonResult = "[" + string.Join(",", subData.Select((x, i) => string.Format("{{label:{0},bars:({1})[0]}}\n", selection.ChildLabels[i].JsonSerialize(), x.ToJson()))) + "]";

            string urls = selection.GetChartUrls();

            return new Dictionary<string, string> {
                { "chart", jsonResult },
                { "urls", urls }
            }.ToJson(false, false, false);
        }

        public static string AssetData(OrganizationSelection organization, LocationSelection location, EmployeeSelection employee, TopazRequest request)
        {

            string employeeJoin;
            string whereClause;
            string[] parameters;
            string[] values;
            Topaz.Domain.Concrete.Dashboards.Assets.Inventory.SetBigAssetQueryData(organization, location, employee, request, out employeeJoin, out whereClause, out parameters, out values);

            string query = string.Format(@"  
                select top {3} {0}
		        from Assets
                inner join Organizations on Organizations.BU = [Assets].BU and Organizations.Home = [Assets].Home and Organizations.Department = [Assets].Department
                inner join Locations on Locations.Building = [Assets].Building
                {2}
                inner join AssetRecordDetail on AssetRecordDetail.AssetId=Assets.AssetId
                left join SimonAssets on SimonAssets.EQUIP_ID=[Assets].SIMON_EQUIP_ID
                left join CmisAssets on CmisAssets.CONTROL_NUMBER=CMIS_CONTROL_NUMBER
                left join SIMONEFBI on SIMONEFBI.Asset_Id=[Assets].EFBI_ASSET_ID
                left join MaximoAssets on MaximoAssets.ASSETID_BestKnown=Assets.Maximo_AssetId
                left join AsmesAssets AssetSmartAssets on AssetSmartAssets.asset_id=[Assets].asmes_asset_id
                left join CribmasterAssets CribA on CribA.SERIALID=[Assets].Cribmaster_SERIALID
                left join CribmasterAssets CribB on CribB.ALTSCANCODE=[Assets].Cribmaster_SERIALID
                where 1=1 {1}", SELECTIONS, whereClause/*.Replace("[Custodian]", "Assets.[Custodian]")*/, employeeJoin, pageAssetLimit);

            //Make employee table to fix issue in iteration 34
            DataTable employeeData = TopazDatabaseUtilities.BemsToNameDataTable();

            DataTable data = TopazDatabaseUtilities.DataTableFromQuery(query, "Topaz", parameters.ToArray(), values.ToArray());
            data.Columns.Add("AssetSystemRecordConsistencyData", typeof(string));
            data.Columns.Add("Organization", typeof(string));
            data.Columns.Add("SourceSystems", typeof(string));

            JavaScriptSerializer serializer = new JavaScriptSerializer();

            StringBuilder builder = new StringBuilder();

            builder.Append("{");

            foreach (DataRow row in data.Rows)
            {
                dynamic bestKnown = new
                {
                    name = "Best known",
                    organization = TopazUtility.FormatOwningDept(TopazDatabaseUtilities.ValueOrDefault<string>("AssetBU", row), TopazDatabaseUtilities.ValueOrDefault<string>("AssetHome", row), TopazDatabaseUtilities.ValueOrDefault<string>("AssetDepartment", row)),
                    location = row["AssetBuilding"],
                    custodian = row["AssetCustodian"],
                    status = row["AssetStatus"],
                    organizationValid = TopazDatabaseUtilities.ValueOrDefault<bool>("AssetOrganizationValid", row),
                    locationValid = TopazDatabaseUtilities.ValueOrDefault<bool>("AssetLocationValid", row),
                    custodianValid = TopazDatabaseUtilities.ValueOrDefault<bool>("AssetCustodianValid", row),
                    statusValid = TopazDatabaseUtilities.ValueOrDefault<bool>("AssetStatusValid", row)
                };

                List<string> systems = new List<string>();

                if ((int)row["ContainsCmis"] == 1)
                {
                    systems.Add("CMIS");
                }
                if ((int)row["ContainsSimon"] == 1)
                {
                    systems.Add("SIMON");
                }
                if ((int)row["ContainsSimonEfbi"] == 1)
                {
                    systems.Add("EAS");
                }
                if ((int)row["ContainsAssetSmart"] == 1)
                {
                    systems.Add("AssetSmart");
                }
                if ((int)row["ContainsMaximo"] == 1)
                {
                    systems.Add("Maximo");
                }
                if ((int)row["ContainsCribmaster"] == 1)
                {
                    systems.Add("Cribmaster");
                }

                row["Organization"] = bestKnown.organization;
                row["SourceSystems"] = string.Join(", ", systems);

                builder.Append(serializer.Serialize(TopazDatabaseUtilities.ValueOrDefault<string>("AssetId", row))).Append(":").Append(GenerateAssetSystemsConsistencyJson(GetSystemsFromDataRow(row, bestKnown), employeeData)).Append(",");

                row["AssetSystemRecordConsistencyData"] = "";
            }

            builder.Append("}");
            
            string countWarningQuery = string.Format(@"  
                select count(*) as assetCount
		        from Assets
                inner join Organizations on Organizations.BU = [Assets].BU and Organizations.Home = [Assets].Home and Organizations.Department = [Assets].Department
                left join Locations on Locations.Building = [Assets].Building
                {1}
                inner join AssetRecordDetail on AssetRecordDetail.AssetId=Assets.AssetId
                where 1=1 {0}", whereClause/*.Replace("[Custodian]", "Assets.[Custodian]")*/, employeeJoin);

            DataTable dataCount = TopazDatabaseUtilities.DataTableFromQuery(countWarningQuery, "Topaz", parameters.ToArray(), values.ToArray());

            string assetCount = dataCount.Rows[0]["assetCount"].ToString();

            string recordConsistency = builder.ToString();

            string assetList = data.ToJson();

            return new Dictionary<string, string>() {
                { "matrix", recordConsistency },
                { "list", assetList },
                { "assetCount", assetCount },
                { "pageLimit", pageAssetLimit.ToString() }
            }.ToJson(quotes: false, autoQuotes: false, serialize: false);
        }

        public static dynamic[] GetSystemsFromDataRow(DataRow row, dynamic bestKnown)
        {
            List<dynamic> systems = new List<dynamic>();

            systems.Add(bestKnown);

            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsCmis", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "CMIS", row["AssetID"], bestKnown, statusNa: true));
            }
            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsSimon", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "SIMON", row["EQUIP_ID"], bestKnown));
            }
            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsSimonEfbi", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "EAS", row["AssetID"], bestKnown, custodianNa: true, showCustodian: false));
            }
            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsAssetSmart", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "AssetSmart", row["AssetID"], bestKnown));
            }
            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsMaximo", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "Maximo", row["AssetID"], bestKnown, showCustodian: false));
            }
            if (TopazDatabaseUtilities.ValueOrDefault<int>("ContainsCribmaster", row) == 1)
            {
                systems.Add(GenerateSystemData(row, "Cribmaster", row["AssetID"], bestKnown, showCustodian: true));
            }

            return systems.ToArray();
        }

        public static dynamic GenerateSystemData(DataRow row, string systemName, object assetId, dynamic bestKnown,
            bool organizationNa = false, bool locationNa = false, bool custodianNa = false, bool statusNa = false,
            bool showOrganization = true, bool showLocation = true, bool showCustodian = true, bool showStatus = true)
        {
            string originalName = systemName;

            systemName = systemName == "EAS" ? "SimonEfbi" : systemName;

            string organization = organizationNa ? "n/a" : TopazUtility.FormatOwningDept(TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "BU", row), TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "Home", row), TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "Department", row));
            string organizationTransform = organizationNa ? "n/a" : TopazUtility.FormatOwningDept(TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "BUTransform", row), TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "HomeTransform", row), TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "DepartmentTransform", row));

            return new
            {
                name = originalName,
                assetId = assetId,
                organizationSource = !showOrganization ? "n/a" : organization,
                locationSource = !showLocation ? "n/a" : row[systemName + "Building"],
                custodianSource = !showCustodian ? "n/a" : row[systemName + "Custodian"],
                statusSource = !showStatus ? "n/a" : row[systemName + "Status"],
                organizationTransformed = !showOrganization ? "n/a" : organizationTransform,
                locationTransformed = !showLocation ? "n/a" : row[systemName + "BuildingTransform"],
                custodianTransformed = !showCustodian ? "n/a" : row[systemName + "CustodianTransform"],
                statusTransformed = !showStatus ? "n/a" : row[systemName + "PropertyStatusTransform"],
                organizationValid = organizationNa ? 0 : TopazDatabaseUtilities.ValueOrDefault<bool>(systemName + "OrganizationValid", row) ? 1 : 0,
                locationValid = locationNa ? 0 : TopazDatabaseUtilities.ValueOrDefault<bool>(systemName + "LocationValid", row) ? 1 : 0,
                custodianValid = custodianNa ? 0 : TopazDatabaseUtilities.ValueOrDefault<bool>(systemName + "CustodianValid", row) ? 1 : 0,
                statusValid = statusNa ? 0 : TopazDatabaseUtilities.ValueOrDefault<bool>(systemName + "PropertyStatusValid", row) ? 1 : 0,
                organizationMatch = organizationNa ? false : organizationTransform.Equals(bestKnown.organization),
                locationMatch = locationNa ? false : row[systemName + "BuildingTransform"].Equals(bestKnown.location),
                custodianMatch = custodianNa ? false : row[systemName + "CustodianTransform"].Equals(bestKnown.custodian),
                statusMatch = statusNa ? false : row[systemName + "PropertyStatusTransform"].Equals(bestKnown.status),
                organizationNa = organizationNa || organizationTransform.Equals("n/a"),
                locationNa = locationNa || TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "BuildingTransform", row) == "n/a",
                custodianNa = custodianNa || TopazDatabaseUtilities.ValueOrDefault<long>(systemName + "CustodianTransform", row) == 0,
                statusNa = statusNa || TopazDatabaseUtilities.ValueOrDefault<string>(systemName + "PropertyStatusTransform", row) == "n/a"
            };
        }

        public static string GenerateAssetSystemsConsistencyJson(dynamic[] systems, DataTable employeeData = null, bool employeeName = false)
        {
            string output = "[";

            foreach (dynamic system in systems)
            {
                output += GenerateSystemConsistencyJson(system, system.name != "Best known", employeeName, employeeData) + ",";
            }

            return output + "]";
        }

        public static string GenerateSystemConsistencyJson(dynamic system, bool sourceTransformed = true, bool employeeName = false, DataTable employeeData = null)
        {
            if (sourceTransformed)
            {
                string custodianSource = system.custodianSource + "";
                string custodianTransformed = system.custodianTransformed + "";

                int temp = 0;

                custodianSource = int.TryParse(custodianSource, out temp) && temp > 0 ? string.Format("<a target=\"_blank\" href=\"https://insite.web.rdgcorp.com/culture/displayBluesInfo.do?bemsid={0}\">{1}</a>", custodianSource, employeeData.Select("BEMSID = " + custodianSource).Length > 0 ? employeeData.Select("BEMSID = " + custodianSource)[0][1] : custodianSource) : custodianSource;
                custodianTransformed = int.TryParse(custodianTransformed, out temp) && temp > 0 ? string.Format("<a target=\"_blank\" href=\"https://insite.web.rdgcorp.com/culture/displayBluesInfo.do?bemsid={0}\">{1}</a>", custodianTransformed, employeeData.Select("BEMSID = " + custodianTransformed).Length > 0 ? employeeData.Select("BEMSID = " + custodianTransformed)[0][1] : custodianTransformed) : custodianTransformed;

                string name = system.name;

                if (name == "SIMON")
                {
                    name = string.Format("<a target=\"_blank\" href=\"http://simon.web.rdgcorp.com/Inventory.aspx?id={0}\">{1}</a>", system.assetId, name);
                }
                else if (name == "CMIS")
                {
                    name = string.Format("<a target=\"_blank\" href=\"https://cmisprod.web.rdgcorp.com/RptEquipDetail.asp?CtrlNo={0}&DispType=HTML\">{1}</a>", system.assetId, name);
                }

                object[] data = { name, system.organizationSource, system.locationSource, custodianSource, system.statusSource,
                    system.organizationTransformed, system.locationTransformed, custodianTransformed, system.statusTransformed,
                    system.organizationValid, system.locationValid, system.custodianValid, system.statusValid,
                    system.organizationMatch, system.locationMatch, system.custodianMatch, system.statusMatch,
                    system.organizationNa, system.locationNa, system.custodianNa, system.statusNa };

                JavaScriptSerializer s = new JavaScriptSerializer();

                return string.Format("{{name:{0},source:{{organization:{1},location:{2},custodian:{3},status:{4}}}," +
                    "transformed:{{organization:{5},location:{6},custodian:{7},status:{8}}}," +
                    "valid:{{organization:{9},location:{10},custodian:{11},status:{12}}}," +
                    "match:{{organization:{13},location:{14},custodian:{15},status:{16}}}," +
                    "na:{{organization:{17},location:{18},custodian:{19},status:{20}}}}}",
                    data.Select(x => s.Serialize(x)).ToArray());
            }
            else
            {
                string custodian = system.custodian + "";

                int temp = 0;

                custodian = int.TryParse(custodian, out temp) && temp > 0 ? string.Format("<a target=\"_blank\" href=\"https://insite.web.rdgcorp.com/culture/displayBluesInfo.do?bemsid={0}\">{1}</a>", custodian, employeeData.Select("BEMSID = " + custodian).Length > 0 ? employeeData.Select("BEMSID = " + custodian)[0][1] : custodian) : custodian;

                return string.Format("{{name:'{0}',organization:'{1}',location:'{2}',custodian:'{3}',status:'{4}'," +
                    "valid:{{organization:{5},location:{6},custodian:{7},status:{8}}}}}",
                    system.name, system.organization, system.location, custodian, system.status,
                    system.organizationValid ? "true" : "false", system.locationValid ? "true" : "false", system.custodianValid ? "true" : "false", system.statusValid ? "true" : "false");
            }
        }
    }
}
