import { useEffect, useRef, useState } from "react";
import APIServices from "./services/ApiServices";
export default function CustomRestrictions() {

  const ApiService = new APIServices()

  const [data, setData] = useState([])
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [requestBody, setRequestBody] = useState({
    limit: 20,
    page: 1,
    search: ""
  })
  const [deleteId, setDeleteId] = useState(null)
  const [formData, setFormData] = useState({
    country: "",
    tax: "",
    tax_name: "",
    customs_limit: "",
    currency: "",
    is_eu: false,
    active: true
  })
  const [validationError, setValidationError] = useState({
    country: "",
    tax: "",
    tax_name: "",
    customs_limit: "",
    currency: "",
  })
  const searchTimeoutRef = useRef(null);
  const requestIdRef = useRef(0);
  const modelRef = useRef()
  const deleteModelRef = useRef()


  const fetchData = async () => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const response = await ApiService.customRestrictionList(requestBody);

      if (currentRequestId !== requestIdRef.current) return;

      setData(response?.result?.data || []);
      setHasNext(response?.result?.pagination?.hasNext || false);
      setHasPrevious(response?.result?.pagination?.hasPrevious || false);
      setCurrentPage(response?.result?.pagination?.currentPage || 1);
    } catch (error) {
      console.error(error);
    } finally {
      // Only stop loading if latest request
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.country)) {
      errors.country = "Only letters and spaces allowed";
    }

    if (formData.tax === "") {
      errors.tax = "Tax is required";
    } else if (!/^\d+$/.test(formData.tax)) {
      errors.tax = "Only numbers allowed";
    } else if (Number(formData.tax) < 0 || Number(formData.tax) > 100) {
      errors.tax = "Tax must be between 0 and 100";
    }

    if (!formData.tax_name.trim()) {
      errors.tax_name = "Tax name is required";
    }

    if (formData.customs_limit === "") {
      errors.customs_limit = "Custom limit is required";
    } else if (!/^\d+$/.test(formData.customs_limit)) {
      errors.customs_limit = "Only numbers allowed";
    } else if (Number(formData.customs_limit) <= 0) {
      errors.customs_limit = "Must be greater than 0";
    }

    if (!formData.currency.trim()) {
      errors.currency = "Currency is required";
    } else if (!/^[A-Z]{3}$/.test(formData.currency)) {
      errors.currency = "Currency must be a 3-letter code";
    }

    setValidationError({
      country: errors.country || "",
      tax: errors.tax || "",
      tax_name: errors.tax_name || "",
      customs_limit: errors.customs_limit || "",
      currency: errors.currency || "",
    });

    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let response;
      console.log("Form Data:", formData);
      if (formData?.id) {
        response = await ApiService.updateCustomRestriction(formData);
      } else {
        response = await ApiService.createCustomRestriction(formData);
      }
      if (!response?.status) {
        shopify.toast.show(response?.message, { duration: 3000, isError: true });
        return
      }
      shopify.toast.show(response?.message, { duration: 3000, tone: "success" });
      setFormData({
        country: "",
        tax: "",
        tax_name: "",
        customs_limit: "",
        currency: "",
        is_eu: false,
        active: true,
      });

      setValidationError({
        country: "",
        tax: "",
        tax_name: "",
        customs_limit: "",
        currency: "",
      });
      fetchData();
      modelRef.current.click()


    } catch (error) {
      console.error(error);
      shopify.toast.show("Error in creating custom restriction", { duration: 3000, isError: true });
      modelRef.current.click()
    }
  };

  const handleDeleteCustomRestriction = async (id) => {
    try {
      setIsBtnLoading(true);
      const response = await ApiService.deleteCustomRestriction({ id });
      if (!response?.status) {
        shopify.toast.show(response?.message, { duration: 3000, isError: true })
      }
      shopify.toast.show(response?.message || "Custom restriction deleted successfully", { duration: 3000 })
    } catch (err) {
      console.log("Error in deleting custom restriction: ", err)
    }
    fetchData()
    setIsBtnLoading(false)
    deleteModelRef.current.click()
  };

  const modalCloseHandler = () => {
    setFormData({
      country: "",
      tax: "",
      tax_name: "",
      customs_limit: "",
      currency: "",
      is_eu: false,
      active: true
    })
    setValidationError({
      country: "",
      tax: "",
      tax_name: "",
      customs_limit: "",
      currency: "",
    })
  }

  useEffect(() => {
    fetchData()
  }, [requestBody])

  return (
    <s-page heading="Customs Restrictions">
      <s-button variant="primary" slot="primary-action" commandFor="modal">Create New Restriction</s-button>
      <s-modal onHide={modalCloseHandler} id="modal" heading={'Create Customs Restrictions'}>
        <s-box padding="small-500" >
          <s-box paddingBlockEnd='small'>
            <s-text-field label='Country' placeholder='Country' value={formData?.country} error={validationError.country} onInput={(e) => {
              setFormData((pre) => ({ ...pre, country: e.target.value }))
            }} />
          </s-box>
          <s-box paddingBlockEnd='small'>
            <s-number-field
              label="Tax"
              placeholder="0"
              step={1}
              min={0}
              max={100}
              value={formData?.tax}
              error={validationError.tax}
              onInput={(e) => {
                setFormData((pre) => ({ ...pre, tax: e.target.value }))
              }}
            />
          </s-box>
          <s-box paddingBlockEnd='small'>
            <s-text-field label='Tax Name' placeholder='Tax Name' value={formData?.tax_name} error={validationError.tax_name} onInput={(e) => {
              setFormData((pre) => ({ ...pre, tax_name: e.target.value }))
            }} />
          </s-box>
          <s-box paddingBlockEnd='small'>
            <s-number-field
              label="Custom Limit"
              placeholder="0"
              step={1}
              min={0}
              max={100}
              value={formData?.customs_limit}
              error={validationError.customs_limit}
              onInput={(e) => {
                setFormData((pre) => ({ ...pre, customs_limit: e.target.value }))
              }}
            />
          </s-box>
          <s-box paddingBlockEnd='small'>
            <s-text-field label='Currency' placeholder='Currency' value={formData?.currency} error={validationError.currency} onInput={(e) => {
              setFormData((pre) => ({ ...pre, currency: e.target.value }))
            }} />
          </s-box>
          <s-box paddingBlockEnd='small'>
            <s-checkbox
              label="Is Eu"
              checked={formData?.is_eu}
              onChange={(e) => {
                console.log(e.target.value)
                setFormData((pre) => ({ ...pre, is_eu: !formData?.is_eu }))
              }}
            />
            <s-checkbox
              label="Active"
              checked={formData?.active}
              onChange={(e) => setFormData((pre) => ({ ...pre, active: !formData?.active }))}
            />
          </s-box>
        </s-box>


        <s-button slot="secondary-actions"
          commandFor="modal" command='--hide' >
          Cancel
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          onClick={handleSave}
          loading={false}
        >
          Save
        </s-button>
      </s-modal>

      <s-modal id="deleteModal" heading={'Delete Customs Restrictions'}>
        <s-box
          padding="base"
        >
          <s-text variant="headingMd" fontWeight="medium">
            Are you sure you want to delete the selected custom restriction rule?
          </s-text>
        </s-box>

        <s-button
          slot="secondary-actions"
          variant="secondary-action"
          commandFor="deleteModal"
          command="--hide"
          ref={deleteModelRef}
        >
          Cancel
        </s-button>
        <s-button
          slot="primary-action"
          variant="primary"
          tone="critical"
          loading={isBtnLoading}
          onClick={() => {
            handleDeleteCustomRestriction(deleteId);
          }}
        >
          Delete
        </s-button>
      </s-modal>
      <s-box display="none"><s-button commandFor="modal" command="--hide" ref={modelRef}></s-button></s-box>

      <s-section padding="none">
        <s-table
          hasNextPage={hasNext}
          hasPreviousPage={hasPrevious}
          loading={loading}
          paginate={data?.length == 0 ? false : true}
          variant="table"
          onNextPage={() => {
            setRequestBody({
              ...requestBody,
              page: currentPage + 1,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onPreviousPage={(e) => {
            setRequestBody({
              ...requestBody,
              page: currentPage - 1,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}>
          <s-search-field
            label="Search"
            placeholder="Search products..."
            value={requestBody?.search}
            slot="filters"
            onInput={(e) => {
              const value = e.target.value.trim();
              if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
              }
              searchTimeoutRef.current = setTimeout(() => {
                setRequestBody((prev) => ({
                  ...prev,
                  search: value,
                  page: 1,
                }));
              }, 400);
            }}
          />

          <s-table-header-row>
            <s-table-header>Country</s-table-header>
            <s-table-header >Currency</s-table-header>
            <s-table-header >Customs Limit</s-table-header>
            <s-table-header >Tax</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header>Action</s-table-header>
          </s-table-header-row>
          <s-table-body>
            {data.map((item, index) => {
              return (
                <s-table-row>
                  <s-table-cell>{item.country}</s-table-cell>
                  <s-table-cell>{item.currency}</s-table-cell>
                  <s-table-cell>{item.customs_limit}</s-table-cell>
                  <s-table-cell>{item.tax}</s-table-cell>
                  <s-table-cell><s-badge tone={item.active ? "success" : "critical"}>{item.active ? "Active" : "Inactive"}</s-badge></s-table-cell>
                  <s-table-cell> <s-grid gridTemplateColumns="1fr 1fr" inlineSize="50px" justifyContent="space-between">
                    <s-button
                      tone="auto"
                      accessibilityLabel="Edit"
                      icon="edit"
                      variant="tertiary"
                      commandFor="modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(item)
                        console.log("edit-------", item)
                      }}
                    />
                    <s-button
                      accessibilityLabel="Delete"
                      tone="critical"
                      icon="delete"
                      variant="tertiary"
                      commandFor="deleteModal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item?.id)
                      }}
                    />
                  </s-grid></s-table-cell>
                </s-table-row>)
            })}
          </s-table-body>
        </s-table>
        {data?.length == 0 && (
          <s-section accessibilityLabel="Empty state section">
            <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
              <s-box maxInlineSize="200px" maxBlockSize="200px">
                <s-image
                  aspectRatio="1/0.5"
                  src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
                  alt="Illustration indicating there is no customs restrictions data yet"
                ></s-image>
              </s-box>
              <s-grid justifyItems="center" maxInlineSize="450px" gap="base">
                <s-stack alignItems="center">
                  <s-heading>No Customs Restrictions Found</s-heading>
                </s-stack>
              </s-grid>
            </s-grid>
          </s-section>
        )}
      </s-section>

    </s-page >
  );
}
