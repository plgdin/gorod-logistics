/**
 * Generated from GL-BWH-SOP-01.docx (the authoritative SOP document).
 * Do not hand-edit; regenerate from the DOCX when the SOP changes.
 */

export interface SOPTextRun {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type SOPBlock =
  | { kind: 'paragraph'; runs: SOPTextRun[] }
  | { kind: 'list'; ordered: boolean; items: SOPTextRun[][] }
  | { kind: 'table'; rows: string[][]; hasHeader: boolean };

export interface SOPFullSection {
  id: string;
  number: string;
  title: string;
  level: 1 | 2 | 3 | 4;
  blocks: SOPBlock[];
}

export const SOP_FULL_SECTIONS: SOPFullSection[] = [
  {
    "id": "sop-1-purpose",
    "number": "1",
    "title": "Purpose",
    "level": 1,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "This SOP establishes standard procedures for the receipt, storage, handling and removal of goods deposited in a Customs bonded warehouse operated by Gorod"
          },
          {
            "text": " Logistics."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The objectives are to:",
            "bold": true
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Maintain proper custody and traceability of bonded goods."
            }
          ],
          [
            {
              "text": "Ensure that cargo is received and removed only in accordance with the applicable Customs procedures."
            }
          ],
          [
            {
              "text": "Define responsibilities of internal staff, supervisors, warehouse management and local union "
            },
            {
              "text": "labor"
            },
            {
              "text": "."
            }
          ],
          [
            {
              "text": "Maintain accurate inventory, transaction records and supporting documentation in the ERP system once implemented."
            }
          ],
          [
            {
              "text": "Establish a clear reporting and escalation structure with the jurisdictional Customs authorities."
            }
          ],
          [
            {
              "text": "Prevent "
            },
            {
              "text": "unauthorized"
            },
            {
              "text": " cargo movements, stock discrepancies, revenue leakage and non-compliance."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-2-scope",
    "number": "2",
    "title": "Scope",
    "level": 1,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "This SOP applies to all warehouse operations involving bonded goods, from the initial shipment registration through final "
          },
          {
            "text": "authorized"
          },
          {
            "text": " removal."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "It covers:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Receipts and inward cargo operations."
            }
          ],
          [
            {
              "text": "Handling, storage and inventory control."
            }
          ],
          [
            {
              "text": "Removal, loading and dispatch."
            }
          ],
          [
            {
              "text": "Union "
            },
            {
              "text": "labor"
            },
            {
              "text": " coordination and internal staff responsibilities."
            }
          ],
          [
            {
              "text": "Customs documentation, reporting and statutory records."
            }
          ],
          [
            {
              "text": "Discrepancies, incidents, physical verification and audit."
            }
          ],
          [
            {
              "text": "ERP transaction recording and approval controls."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-3-role-responsibilities",
    "number": "3",
    "title": "Role Responsibilities",
    "level": 1,
    "blocks": []
  },
  {
    "id": "sop-1-warehouse-keeper",
    "number": "1",
    "title": "Warehouse Keeper",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Overall responsibility for warehouse operations and Customs compliance."
            }
          ],
          [
            {
              "text": "Liaison with the Customs Bond Officer."
            }
          ],
          [
            {
              "text": "Ensure required notifications, approvals and statutory filings are completed."
            }
          ],
          [
            {
              "text": "Handle escalations, discrepancies and special cases."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-2-admin-team-customs-compliance-documentation",
    "number": "2",
    "title": "Admin Team — Customs Compliance & Documentation",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Obtain customer onboarding, shipment and billing details before cargo arrival."
            }
          ],
          [
            {
              "text": "Collect and verify required documents from customers."
            }
          ],
          [
            {
              "text": "Prepare and issue Space Certificates and Goods Received Acknowledgements, as applicable."
            }
          ],
          [
            {
              "text": "Notify the Customs Bond Officer by email of incoming cargo and reportable discrepancies."
            }
          ],
          [
            {
              "text": "Prepare Customs returns and maintain correspondence and filing records."
            }
          ],
          [
            {
              "text": "Coordinate customer requests, removal documentation and customer dashboard updates."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-3-warehouse-manager-operations-team",
    "number": "3",
    "title": "Warehouse Manager — Operations Team",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Manage receipts, handling, storage, inventory and removal."
            }
          ],
          [
            {
              "text": "Complete receipt checks and verify cargo quantity, condition, seals and weight details."
            }
          ],
          [
            {
              "text": "Coordinate local union "
            },
            {
              "text": "labor"
            },
            {
              "text": " for loading, unloading and cargo movement."
            }
          ],
          [
            {
              "text": "Coordinate onsite with the Customs Bond Officer when attendance or inspection is required."
            }
          ],
          [
            {
              "text": "Update inventory and operational records in ERP."
            }
          ],
          [
            {
              "text": "Ensure cargo is not released without the required Customs clearance and internal approvals."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-security-team",
    "number": "4",
    "title": "Security Team",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Maintain physical inward and outward registers."
            }
          ],
          [
            {
              "text": "Record vehicle, driver and individual entry details."
            }
          ],
          [
            {
              "text": "Check staff and union "
            },
            {
              "text": "labor"
            },
            {
              "text": " ID cards; issue visitor tags and verify required safety gear."
            }
          ],
          [
            {
              "text": "Verify outward gate passes before permitting vehicles and cargo to exit."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-5-accounts-team",
    "number": "5",
    "title": "Accounts Team",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Prepare customer invoices."
            }
          ],
          [
            {
              "text": "Verify outstanding dues and payment status."
            }
          ],
          [
            {
              "text": "Issue the No-Due Receipt/Certificate or applicable financial clearance before removal."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-6-customs-bond-officer-external-authority",
    "number": "6",
    "title": "Customs Bond Officer — External Authority",
    "level": 3,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Oversee warehouse operations as required by Customs procedures and instructions."
            }
          ],
          [
            {
              "text": "Receive required notifications concerning incoming cargo and discrepancies."
            }
          ],
          [
            {
              "text": "Attend receipt, handling, removal or transportation activities when required."
            }
          ],
          [
            {
              "text": "Provide directions for inspections, discrepancies and special cases."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-standard-operating-procedures",
    "number": "4",
    "title": "Standard Operating Procedures",
    "level": 1,
    "blocks": []
  },
  {
    "id": "sop-4-1-receipt-of-goods",
    "number": "4.1",
    "title": "Receipt of Goods",
    "level": 2,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Objective: ",
            "bold": true
          },
          {
            "text": "To ensure that every consignment entering Gorod"
          },
          {
            "text": " Logistics"
          },
          {
            "text": " Customs Bonded Warehouse is documented, notified to Customs where required, inspected, weighed, photographed, recorded in ERP and stored in its assigned bin location."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Scope: ",
            "bold": true
          },
          {
            "text": "This procedure covers two types of inward movement:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Cargo received directly from a Customs station."
            }
          ],
          [
            {
              "text": "Cargo transferred from another warehouse."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-1-customer-enquiry-and-job-number-creation",
    "number": "4.1.1",
    "title": "Customer enquiry and Job Number creation",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Receive the customer's enquiry for warehouse space and services."
            }
          ],
          [
            {
              "text": "Open a new job in Gorod"
            },
            {
              "text": " Logistics"
            },
            {
              "text": " ERP once the enquiry is registered and the Space Certificate process is initiated."
            }
          ],
          [
            {
              "text": "Generate a unique Job Number, which will serve as the master reference ID for that consignment throughout its warehouse lifecycle."
            }
          ],
          [
            {
              "text": "Link all documents, communications, cargo details, receipt records, inventory, billing and subsequent removal transactions to this Job Number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Job creation rule: Each Bill of Entry (BOE) must have a separate Job Number, even when multiple BOEs belong to the same customer. The customer's account remains common, but each BOE is processed and tracked as an individual job."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-2-customer-onboarding-and-document-collection",
    "number": "4.1.2",
    "title": "Customer onboarding and document collection",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Send the customer a registration and document-upload link to Gorod"
            },
            {
              "text": " Logistics"
            },
            {
              "text": " customer portal."
            }
          ],
          [
            {
              "text": "The customer signs up and enters the required shipment and contact details."
            }
          ],
          [
            {
              "text": "Admin reviews the submitted information and obtains any missing documents or corrections before cargo arrival."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The following minimum information must be obtained, as applicable:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Customer/company name and "
            },
            {
              "text": "authorized"
            },
            {
              "text": " contact details."
            }
          ],
          [
            {
              "text": "Importer/exporter and customs broker details."
            }
          ],
          [
            {
              "text": "Bill of Entry (BOE) number and date."
            }
          ],
          [
            {
              "text": "Bond number and bond date."
            }
          ],
          [
            {
              "text": "Cargo description and package count."
            }
          ],
          [
            {
              "text": "Declared weight and other available cargo particulars."
            }
          ],
          [
            {
              "text": "Invoice, packing list and relevant transport documents."
            }
          ],
          [
            {
              "text": "Origin of cargo: Customs station or another warehouse."
            }
          ],
          [
            {
              "text": "Port Code/Warehouse Code"
            }
          ],
          [
            {
              "text": "Applicable Customs warehousing or transfer "
            },
            {
              "text": "authorization"
            },
            {
              "text": "."
            }
          ],
          [
            {
              "text": "Vehicle, transport and OTL details, when available."
            }
          ],
          [
            {
              "text": "Special handling requirements or other relevant instructions."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Admin must verify that the documents required for the particular type of receipt are available before confirming readiness."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-3-space-certificate-issuance",
    "number": "4.1.3",
    "title": "Space Certificate issuance",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team Approval: Warehouse Keeper"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Admin checks the requested space, customer details and available shipment information."
            }
          ],
          [
            {
              "text": "Admin prepares the Space Certificate."
            }
          ],
          [
            {
              "text": "The Warehouse Keeper reviews and signs the certificate."
            }
          ],
          [
            {
              "text": "Admin issues the signed Space Certificate to the customer and uploads a copy against the Job Number in ERP."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The Space Certificate confirms warehouse space availability only. It does not replace any Customs approval, transfer "
          },
          {
            "text": "authorization"
          },
          {
            "text": " or other permission required for the movement of goods."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-4-eta-entry-and-pre-arrival-coordination",
    "number": "4.1.4",
    "title": "ETA entry and pre-arrival coordination",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team and Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "The customer may enter the expected time of arrival (ETA) through the customer portal or communicate it directly to Admin."
            }
          ],
          [
            {
              "text": "If the ETA is received directly, Admin enters or updates it in ERP."
            }
          ],
          [
            {
              "text": "ERP alerts the Operations Team when the ETA is entered or changed."
            }
          ],
          [
            {
              "text": "Admin shares the Job Number and the relevant customer contact details with Operations."
            }
          ],
          [
            {
              "text": "Admin emails the Customs Bond Officer with the consignment details and expected arrival time in accordance with the applicable Customs notification procedure."
            }
          ],
          [
            {
              "text": "Admin contacts the Bond Officer to confirm whether onsite attendance is required."
            }
          ],
          [
            {
              "text": "The Warehouse Manager coordinates with the customer, arranges local union "
            },
            {
              "text": "labor"
            },
            {
              "text": " and prepares the acceptance zone, weighing equipment and receipt checklist."
            }
          ],
          [
            {
              "text": "Where a Customs Inspector escorts the cargo, Operations coordinates the arrival and follows the Inspector's directions."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Any special handling, transport, inspection or receipt requirement must be communicated to the Warehouse Keeper and the relevant teams before arrival, wherever known."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-5-vehicle-arrival-and-inward-entry",
    "number": "4.1.5",
    "title": "Vehicle arrival and inward entry",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Security Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Record the arrival date and time in the physical inward register."
            }
          ],
          [
            {
              "text": "Record the vehicle registration number, driver details and other required particulars."
            }
          ],
          [
            {
              "text": "Verify the vehicle against the available transport and shipment information."
            }
          ],
          [
            {
              "text": "Direct the vehicle to the designated inspection or acceptance zone."
            }
          ],
          [
            {
              "text": "Ensure that the required personnel access and safety procedures are followed."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Identify the consignment using its Job Number."
            }
          ],
          [
            {
              "text": "Match the shipment against the BOE or applicable warehouse transfer documents."
            }
          ],
          [
            {
              "text": "Verify the applicable security arrangement before unloading: OTL or Customs escort documentation."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-6-otl-and-customs-escort-verification",
    "number": "4.1.6",
    "title": "OTL and Customs escort verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Operations Team Coordination: Admin Team and Warehouse Keeper"
          }
        ]
      }
    ]
  },
  {
    "id": "sop-cargo-arriving-with-an-otl",
    "number": "",
    "title": "Cargo arriving with an OTL",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Check the OTL number and inspect its condition before unloading."
            }
          ],
          [
            {
              "text": "Record the OTL details and condition in ERP."
            }
          ],
          [
            {
              "text": "Photograph the seal and relevant vehicle/transport condition."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "If the OTL is missing, broken, tampered with or otherwise inconsistent with the documents:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Do not unload the cargo."
            }
          ],
          [
            {
              "text": "Inform the Warehouse Keeper and Admin immediately."
            }
          ],
          [
            {
              "text": "Admin notifies the Customs Bond Officer by email and records the communication in ERP."
            }
          ],
          [
            {
              "text": "Keep the cargo secured pending the required Customs instructions or "
            },
            {
              "text": "authorization"
            },
            {
              "text": "."
            }
          ],
          [
            {
              "text": "Resume only when permitted under the applicable Customs procedure."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-cargo-arriving-under-customs-escort-instead-of-an-otl",
    "number": "",
    "title": "Cargo arriving under Customs escort instead of an OTL",
    "level": 4,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Where cargo is accompanied by a Customs Inspector instead of being secured with an OTL:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Obtain a written Customs Escort Receipt/Acknowledgement from the accompanying Inspector."
            }
          ],
          [
            {
              "text": "Ensure that the document bears the Inspector's signature and official seal."
            }
          ],
          [
            {
              "text": "Record the Job Number, BOE/bond reference, vehicle registration, cargo details, date and time, and the Inspector's name and designation, where available."
            }
          ],
          [
            {
              "text": "Upload the signed acknowledgement to ERP against the relevant Job Number."
            }
          ],
          [
            {
              "text": "Follow any additional instructions issued by Customs before unloading."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "If the required escort acknowledgement or applicable Customs "
          },
          {
            "text": "authorization"
          },
          {
            "text": " is unavailable, do not unload until the matter is resolved in accordance with Customs instructions."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-7-pre-unloading-inspection-and-acceptance-checks",
    "number": "4.1.7",
    "title": "pre-unloading inspection and acceptance checks",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Before unloading, Operations must complete the receipt checklist in ERP."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            "Checkpoint",
            "Required action"
          ],
          [
            "Job and documents",
            "Confirm the Job Number and match the BOE or transfer documents."
          ],
          [
            "Vehicle",
            "Record vehicle registration and photograph the vehicle and number plate."
          ],
          [
            "OTL / escort",
            "Verify the seal condition or obtain the signed and sealed Customs Escort Receipt, as applicable."
          ],
          [
            "Cargo description",
            "Check the description against the available documents."
          ],
          [
            "Package count",
            "Verify the declared package count and record any visible difference."
          ],
          [
            "Cargo condition",
            "Check for damage, tampering, leakage or other visible abnormalities."
          ],
          [
            "Weight",
            "Identify the declared/reference weight and arrange actual weighing."
          ],
          [
            "Customs attendance",
            "Confirm whether the Bond Officer or Inspector must be present."
          ],
          [
            "Unloading readiness",
            "Confirm that the required documents, checks and permissions are complete."
          ]
        ],
        "hasHeader": true
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "If a discrepancy is identified before unloading, Operations must immediately inform the Warehouse Keeper. Admin must notify the Bond Officer where required. Unloading must not proceed where the discrepancy requires Customs intervention or "
          },
          {
            "text": "authorization"
          },
          {
            "text": "."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-8-unloading-and-detailed-cargo-verification",
    "number": "4.1.8",
    "title": "Unloading and detailed cargo verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Once the required checks and permissions are satisfactory:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Coordinate unloading with local union "
            },
            {
              "text": "labor"
            },
            {
              "text": "."
            }
          ],
          [
            {
              "text": "Supervise the unloading and tally of the cargo."
            }
          ],
          [
            {
              "text": "Verify the actual package count against the relevant documents."
            }
          ],
          [
            {
              "text": "Check and record the condition of the cargo and packaging."
            }
          ],
          [
            {
              "text": "Weigh the cargo using the approved weighing equipment and procedure."
            }
          ],
          [
            {
              "text": "Measure cargo dimensions and calculate volume, where applicable."
            }
          ],
          [
            {
              "text": "Take and upload 360-degree photographs of the cargo, including visible damage or discrepancies."
            }
          ],
          [
            {
              "text": "Record the actual weight, package count, condition and other receipt particulars in ERP in real time."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Cargo must first be placed in the designated acceptance zone for inspection and verification before final bin allocation."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-weight-discrepancy-escalation",
    "number": "",
    "title": "Weight discrepancy escalation",
    "level": 4,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Where the actual weight differs from the applicable declared/reference weight by more than ±5 kg:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Operations "
            },
            {
              "text": "record"
            },
            {
              "text": " the actual weight, reference weight and difference in ERP."
            }
          ],
          [
            {
              "text": "Operations immediately "
            },
            {
              "text": "inform"
            },
            {
              "text": " Admin and the Warehouse Keeper."
            }
          ],
          [
            {
              "text": "Admin emails the Customs Bond Officer with the Job Number, cargo details, weight difference and supporting evidence."
            }
          ],
          [
            {
              "text": "Operations "
            },
            {
              "text": "coordinate"
            },
            {
              "text": " onsite inspection or further weighing if required."
            }
          ],
          [
            {
              "text": "The discrepancy and any Customs instructions are recorded against the Job Number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The ±5 kg threshold is Gorod"
          },
          {
            "text": " Logistics "
          },
          {
            "text": "internal escalation trigger. It does not replace any stricter reporting requirement or threshold specified by Customs. Other discrepancies, including shortages, excess packages, damaged cargo and seal issues, must also be reported according to applicable requirements."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-9-bin-allocation-barcode-and-storage",
    "number": "4.1.9",
    "title": "Bin allocation, barcode and storage",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "After weighing and verification, the Warehouse Manager assigns a storage bin/location in ERP."
            }
          ],
          [
            {
              "text": "ERP records the Job Number, cargo details, quantity, actual weight, dimensions and assigned bin."
            }
          ],
          [
            {
              "text": "Generate and affix a barcode label to the cargo or appropriate handling unit."
            }
          ],
          [
            {
              "text": "Scan the barcode and confirm the assigned bin location."
            }
          ],
          [
            {
              "text": "Move the cargo to the designated bin using the approved handling process."
            }
          ],
          [
            {
              "text": "Update the cargo's storage status and inventory in ERP."
            }
          ],
          [
            {
              "text": "Record any unresolved discrepancy or restriction against the Job Number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The physical location of the cargo must correspond with the bin location recorded in ERP."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-10-goods-received-acknowledgement",
    "number": "4.1.10",
    "title": "Goods Received Acknowledgement",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team Input: Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "After completing the receipt checks, Operations submits the verified cargo details and supporting evidence through ERP."
            }
          ],
          [
            {
              "text": "Admin reviews the submitted details and prepares the Goods Received Acknowledgement / Goods Received Receipt."
            }
          ],
          [
            {
              "text": "The document must reflect the actual quantity and condition recorded at receipt, with any relevant discrepancy clearly noted."
            }
          ],
          [
            {
              "text": "The "
            },
            {
              "text": "authorized"
            },
            {
              "text": " person signs and applies Gorod"
            },
            {
              "text": " Logistics"
            },
            {
              "text": " official seal."
            }
          ],
          [
            {
              "text": "Admin emails the signed acknowledgement to the customer and the relevant Customs officer(s), including the Bond Officer and inspecting officer where applicable."
            }
          ],
          [
            {
              "text": "Upload the signed acknowledgement and email trail to ERP against the Job Number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The acknowledgement must not state that cargo was received without discrepancy if an exception was recorded."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-11-physical-inward-register",
    "number": "4.1.11",
    "title": "Physical inward register",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Security Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Gorod will maintain a basic physical register as a backup to the detailed ERP records."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The inward register must contain, at minimum:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Date and time of arrival."
            }
          ],
          [
            {
              "text": "Job Number."
            }
          ],
          [
            {
              "text": "BOE/bond reference or transfer reference."
            }
          ],
          [
            {
              "text": "Vehicle registration number."
            }
          ],
          [
            {
              "text": "OTL number or Customs escort reference, as applicable."
            }
          ],
          [
            {
              "text": "Package count received."
            }
          ],
          [
            {
              "text": "Receipt status or discrepancy reference."
            }
          ],
          [
            {
              "text": "Signatures of the responsible Gorod representative, driver and Customs Inspector, "
            },
            {
              "text": "where"
            },
            {
              "text": " present and applicable."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Detailed cargo measurements, photographs, document uploads, inventory and bin locations will be maintained in ERP."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-1-12-receipt-closure",
    "number": "4.1.12",
    "title": "Receipt closure",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The receipt job may be marked complete in ERP once:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Required customer documents and applicable Customs checks are completed."
            }
          ],
          [
            {
              "text": "OTL or Customs escort verification is recorded."
            }
          ],
          [
            {
              "text": "The receipt checklist is completed."
            }
          ],
          [
            {
              "text": "Actual package count, weight, dimensions and cargo condition are recorded."
            }
          ],
          [
            {
              "text": "Required photographs are uploaded."
            }
          ],
          [
            {
              "text": "Cargo is barcoded and assigned to a bin location."
            }
          ],
          [
            {
              "text": "The inward register is completed."
            }
          ],
          [
            {
              "text": "The signed Goods Received Acknowledgement is issued and filed."
            }
          ],
          [
            {
              "text": "Any discrepancy is documented, notified and either resolved or retained as an open, tracked exception."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-removal-of-goods",
    "number": "4.2",
    "title": "Removal of Goods",
    "level": 2,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Objective: ",
            "bold": true
          },
          {
            "text": "To ensure that all goods removed from Gorod"
          },
          {
            "text": " Logistics"
          },
          {
            "text": " Customs Bonded Warehouse are released only against the correct customer request, verified documentation, applicable Customs clearance or permission, physical quantity verification, financial clearance and "
          },
          {
            "text": "authorized"
          },
          {
            "text": " gate pass."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Every removal must be traceable to the original Job Number and Into-Bond Bill of Entry (BOE), including partial removals."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-scope-types-of-removal-and-mandatory-documents",
    "number": "",
    "title": "Scope: Types of removal and mandatory documents",
    "level": 4,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The customer must select the removal type and specify the quantity to be released when submitting the request through the customer portal."
          }
        ]
      },
      {
        "kind": "table",
        "rows": [
          [
            "Removal type",
            "Mandatory document and verification"
          ],
          [
            "1.Home Consumption",
            "Ex-Bond Bill of Entry with the proper officer’s Out of Charge (OOC) copy. Confirm that applicable duty, interest, fine and penalties have been paid and that the required Customs/Bond Officer permission for physical removal is in place."
          ],
          [
            "2. Re-export",
            "Applicable Ex-Bond Shipping Bill with Let Export Order (LEO) and the required clearance order under Section 69. The Bond Officer’s required involvement at loading and the one-time-lock (OTL) requirements must be fulfilled."
          ],
          [
            "3.Transfer to another warehouse",
            "Customer-signed prescribed Form for Transfer of Goods from a Warehouse under Section 67, bearing the required Bond Officer permission, together with destination warehouse details and transport particulars. An OTL is required unless a valid exemption is permitted by the competent Customs authority."
          ]
        ],
        "hasHeader": true
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Important note on the transfer form: The central Warehoused Goods (Removal) Regulations, 2016 refer to the prescribed document as the Form for transfer of goods from a warehouse. If the local Customs workflow calls the document “Form A,” Gorod should confirm that the version used is the applicable, currently accepted form. "
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The above are the minimum document controls for this SOP. Additional documents or approvals required by the applicable Customs procedure must also be obtained before release."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-1-customer-removal-request-and-quantity-confirmation",
    "number": "4.2.1",
    "title": "Customer removal request and quantity confirmation",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Receive the customer's request for removal of goods through the Gorod Logistics customer portal."
            }
          ],
          [
            {
              "text": "Ensure that the customer selects the removal type: Home Consumption, Re-export or Transfer to Another Warehouse."
            }
          ],
          [
            {
              "text": "Obtain the quantity and package count to be released, along with the requested delivery date/ETD and other relevant details."
            }
          ],
          [
            {
              "text": "Verify the original Job Number and Into-Bond BOE reference against which the goods were received."
            }
          ],
          [
            {
              "text": "Create a removal request/transaction in ERP and link it to the original Job Number."
            }
          ],
          [
            {
              "text": "Verify the available inventory and confirm that the requested quantity is available for removal."
            }
          ],
          [
            {
              "text": "Guide the customer on the documents and requirements applicable to the selected removal type."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Removal tracking rule: Every removal must be linked to the original Job Number and Into-Bond BOE. Each partial removal must be recorded separately, and the remaining quantity must continue to be tracked in ERP."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-2-removal-document-collection-and-verification",
    "number": "4.2.2",
    "title": "Removal document collection and verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Obtain the supporting documents required for the selected removal type."
            }
          ],
          [
            {
              "text": "Review the documents for completeness and verify the Job Number, BOE reference, cargo description and requested quantity."
            }
          ],
          [
            {
              "text": "Obtain any missing documents, corrections or additional information from the customer before proceeding."
            }
          ],
          [
            {
              "text": "Record the documents against the relevant Job Number and removal request in ERP."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The following minimum documentation must be obtained, as applicable:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Customer/company name and authorized contact details."
            }
          ],
          [
            {
              "text": "Original Job Number and Into-Bond BOE number/date."
            }
          ],
          [
            {
              "text": "Removal type and requested quantity/package count."
            }
          ],
          [
            {
              "text": "Requested delivery date/ETD."
            }
          ],
          [
            {
              "text": "Home Consumption: Ex-Bond Bill of Entry with Out of Charge (OOC) copy."
            }
          ],
          [
            {
              "text": "Re-export: Shipping Bill with Let Export Order (LEO) copy."
            }
          ],
          [
            {
              "text": "Transfer to Another Warehouse: Applicable transfer form under Section 67, referred to as Form A where applicable, with the required Customs permission."
            }
          ],
          [
            {
              "text": "Destination warehouse details or export destination details, as applicable."
            }
          ],
          [
            {
              "text": "Vehicle and transport details, when available."
            }
          ],
          [
            {
              "text": "Applicable Customs clearance, permission or other supporting documentation."
            }
          ],
          [
            {
              "text": "Special handling or transport instructions, where applicable."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Admin must verify that the documents required for the particular type of removal are available and that the applicable Customs clearance or authorization requirements are fulfilled before release."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-3-customs-notification-and-etd-update",
    "number": "4.2.3",
    "title": "Customs notification and ETD update",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Notify the concerned Customs Bond Officer by replying to the original email thread used for the receipt notification of the consignment."
            }
          ],
          [
            {
              "text": "Retain the Job Reference Number as the email subject to maintain continuity with the original receipt correspondence."
            }
          ],
          [
            {
              "text": "Include the original Into-Bond BOE number, removal type, cargo description, requested quantity and relevant supporting documents in the email."
            }
          ],
          [
            {
              "text": "Admin "
            },
            {
              "text": "Update"
            },
            {
              "text": "s"
            },
            {
              "text": " the planned delivery date/ETD in ERP."
            }
          ],
          [
            {
              "text": "Admin emails the Customs Bond Officer with the consignment details and expected "
            },
            {
              "text": "delivery"
            },
            {
              "text": " time in accordance with the applicable Customs notification procedure."
            }
          ],
          [
            {
              "text": "Coordinate with the Bond Officer regarding any required approval, inspection or attendance for the removal."
            }
          ],
          [
            {
              "text": "Record the Customs correspondence, instructions and required permissions against the Job Number in ERP."
            }
          ],
          [
            {
              "text": "Notify the Operations Team through ERP and share the Job Number, requested quantity, removal type and relevant document references."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Control rule: Sending an email to Customs does not, by itself, constitute authorization to remove the goods. The required Customs clearance or permission must be verified before the cargo is released."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-4-cargo-picking-and-movement-to-delivery-zone",
    "number": "4.2.4",
    "title": "Cargo picking and movement to delivery zone",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Receive the removal notification and identify the cargo using the Job Number and ERP inventory."
            }
          ],
          [
            {
              "text": "Locate the cargo in its assigned bin location."
            }
          ],
          [
            {
              "text": "Verify the barcode, cargo description, available quantity and package count against the removal request."
            }
          ],
          [
            {
              "text": "Pick only the quantity requested and verified for removal."
            }
          ],
          [
            {
              "text": "Move the selected cargo from the storage area to the designated delivery zone."
            }
          ],
          [
            {
              "text": "Update the relevant cargo movement status in ERP."
            }
          ],
          [
            {
              "text": "Ensure that any remaining cargo is correctly identified and continues to be recorded against the original Job Number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Any discrepancy in cargo identity, quantity, package count or condition must be reported to the Warehouse Keeper and Admin before proceeding with the removal."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-5-physical-verification-weighing-and-photography",
    "number": "4.2.5",
    "title": "Physical verification, weighing and photography",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Verify the cargo and package count at the delivery zone against the removal request and supporting documents."
            }
          ],
          [
            {
              "text": "Weigh the cargo using the warehouse weighing scale and record the actual weight in ERP."
            }
          ],
          [
            {
              "text": "Check and record the visible condition of the cargo and its packaging."
            }
          ],
          [
            {
              "text": "Take photographs of the cargo before release."
            }
          ],
          [
            {
              "text": "For re-export and transfers to another warehouse, take photographs of the vehicle registration plate, vehicle details and applicable seal/OTL, and record the relevant seal/OTL number."
            }
          ],
          [
            {
              "text": "Record the actual quantity, package count, weight, condition, photographs and verification details in ERP."
            }
          ],
          [
            {
              "text": "Report any discrepancy or damage to the Warehouse Keeper and Admin for further action before release."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "If the required OTL/seal is unavailable, broken or inconsistent, the cargo must not be dispatched unless the applicable Customs authorization permitting movement without the OTL/seal has been verified and documented."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-6-invoice-payment-and-no-due-certificate",
    "number": "4.2.6",
    "title": "Invoice, payment and No-Due Certificate",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Accounts Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Calculate the applicable warehouse and handling charges based on Gorod Logistics' published tariff and the services provided."
            }
          ],
          [
            {
              "text": "Prepare and issue the invoice for the removal."
            }
          ],
          [
            {
              "text": "Verify receipt and clearance of payment."
            }
          ],
          [
            {
              "text": "Issue the No-Due Certificate (NDC) or applicable financial clearance after confirming that all dues have been settled."
            }
          ],
          [
            {
              "text": "Update the invoice, payment and NDC status in ERP."
            }
          ],
          [
            {
              "text": "Notify Admin that financial clearance has been completed."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The Outpass/Gate Pass must not be issued until the required financial clearance is available, unless an authorized credit arrangement or written internal exception applies."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-7-removal-type-specific-verification",
    "number": "4.2.7",
    "title": "Removal-type-specific verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team / Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "A. Home Consumption"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Verify the Ex-Bond Bill of Entry and OOC copy."
            }
          ],
          [
            {
              "text": "Confirm that the cargo and quantity correspond with the applicable clearance documents."
            }
          ],
          [
            {
              "text": "Verify that the required Customs clearance and removal formalities have been completed."
            }
          ],
          [
            {
              "text": "File the documents against the original Job Number and update the quantity released in ERP."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "B. Re-export"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Verify the Shipping Bill and LEO copy."
            }
          ],
          [
            {
              "text": "Confirm that the cargo and quantity correspond with the applicable export documents."
            }
          ],
          [
            {
              "text": "Coordinate any required Customs inspection or attendance during loading."
            }
          ],
          [
            {
              "text": "Record the vehicle details and take photographs of the vehicle registration plate and applicable seal/OTL."
            }
          ],
          [
            {
              "text": "Record the seal/OTL number and related details in ERP."
            }
          ],
          [
            {
              "text": "Verify that the applicable Customs clearance and transport requirements have been fulfilled before dispatch."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "C. Transfer to Another Warehouse"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Verify the customer's prescribed transfer documentation"
            },
            {
              "text": " Form A"
            },
            {
              "text": " under Section 67 and the required Customs permission."
            }
          ],
          [
            {
              "text": "Confirm the destination warehouse details and the cargo quantity to be transferred."
            }
          ],
          [
            {
              "text": "Verify the vehicle and transport details."
            }
          ],
          [
            {
              "text": "Ensure that the required OTL/seal is applied and recorded, unless a valid Customs authorization permits movement without it."
            }
          ],
          [
            {
              "text": "Take photographs of the cargo, vehicle registration plate and applicable seal/OTL."
            }
          ],
          [
            {
              "text": "Record the transfer documentation, vehicle details and seal/OTL details in ERP."
            }
          ],
          [
            {
              "text": "Track the receiving warehouse acknowledgement and file it against the Job Number once received."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Where the required OTL/seal is not available, the applicable written Customs authorization or acknowledgement permitting movement without the OTL/seal must be verified and retained before dispatch."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-8-outpass-gate-pass-issuance-and-cargo-release",
    "number": "4.2.8",
    "title": "Outpass/Gate Pass issuance and cargo release",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Verification: Warehouse Manager / Operations Team and Accounts Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Confirm that the removal request and relevant documents have been verified."
            }
          ],
          [
            {
              "text": "Confirm that the applicable Customs clearance or permission is in place."
            }
          ],
          [
            {
              "text": "Obtain the Operations Team's confirmation of cargo identity, quantity, weight and condition."
            }
          ],
          [
            {
              "text": "Confirm that the required photographs and vehicle/seal details, where applicable, are recorded."
            }
          ],
          [
            {
              "text": "Verify that the Accounts Team has issued the NDC or applicable financial clearance."
            }
          ],
          [
            {
              "text": "Prepare and issue the Outpass/Gate Pass."
            }
          ],
          [
            {
              "text": "Record the Outpass/Gate Pass number against the Job Number in ERP and retain a copy in the removal records."
            }
          ],
          [
            {
              "text": "Inform Security and Operations that the cargo is authorized for gate-out."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The Outpass/Gate Pass is Gorod Logistics internal release document and does not replace any statutory Customs clearance or permission required for the removal."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-9-outward-register-and-gate-out-verification",
    "number": "4.2.9",
    "title": "Outward register and gate-out verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Security Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Verify the Outpass/Gate Pass before allowing the cargo to exit."
            }
          ],
          [
            {
              "text": "Check the vehicle registration, driver details and cargo quantity against the release documents."
            }
          ],
          [
            {
              "text": "Verify the applicable seal/OTL details for re-export and warehouse transfers."
            }
          ],
          [
            {
              "text": "Confirm that the necessary transport documents accompany the consignment."
            }
          ],
          [
            {
              "text": "Record the physical outward movement in the outward register."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "The outward register must contain, at a minimum:"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Date and time of gate-out."
            }
          ],
          [
            {
              "text": "Job Number and Into-Bond BOE reference."
            }
          ],
          [
            {
              "text": "Customer name and removal type."
            }
          ],
          [
            {
              "text": "Cargo description and quantity/package count."
            }
          ],
          [
            {
              "text": "Outpass/Gate Pass number."
            }
          ],
          [
            {
              "text": "Vehicle registration and driver details."
            }
          ],
          [
            {
              "text": "Seal/OTL number, where applicable."
            }
          ],
          [
            {
              "text": "Relevant Customs authorization or acknowledgement reference."
            }
          ],
          [
            {
              "text": "Signatures of the responsible Gorod representative and driver, and the Customs Inspector where applicable."
            }
          ]
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Confirm that the recorded details correspond with the actual cargo leaving the warehouse."
            }
          ],
          [
            {
              "text": "Record the actual gate-out date and time in the physical register and update ERP as per the established workflow."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-2-10-inventory-update-and-removal-closure",
    "number": "4.2.10",
    "title": "Inventory update and removal closure",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team and Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Update ERP inventory to reflect the actual quantity removed."
            }
          ],
          [
            {
              "text": "Confirm that the remaining balance, if any, is correctly recorded against the original Job Number."
            }
          ],
          [
            {
              "text": "Ensure that the removal request, Customs correspondence, supporting documents, Operations verification, photographs, invoice, payment confirmation, NDC and Outpass/Gate Pass are filed against the Job Number."
            }
          ],
          [
            {
              "text": "Ensure that the physical outward register entry is complete."
            }
          ],
          [
            {
              "text": "For transfers to another warehouse, keep the follow-up open until the destination warehouse acknowledgement is received and recorded, or the outstanding matter is otherwise resolved in accordance with applicable Customs instructions."
            }
          ],
          [
            {
              "text": "Close the removal transaction in ERP after the required records and inventory updates are complete and any outstanding discrepancies or follow-up actions have been resolved or documented."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Closure rule: The removal is complete only when the cargo has physically exited the warehouse, the outward register is completed, the inventory is updated, and all applicable documentation and outstanding follow-up actions are recorded against the Job Number."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-handling-and-storage-activities",
    "number": "4.3",
    "title": "Handling and Storage Activities",
    "level": 2,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Objective: ",
            "bold": true
          },
          {
            "text": "To ensure that all handling and storage-related activities at Gorod Logistics Customs Bonded Warehouse are requested or recorded, verified, approved where required, documented and updated in ERP and the applicable Customs records."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Scope: This procedure covers the following activities listed in the uploaded warehouse return format: "
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Activities under Section 64."
            }
          ],
          [
            {
              "text": "Samples drawn by government agencies."
            }
          ],
          [
            {
              "text": "Extension of the warehousing period."
            }
          ],
          [
            {
              "text": "Bank guarantees taken during the month."
            }
          ],
          [
            {
              "text": "Relinquishment of warehoused goods."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-1-customer-request-and-job-reference",
    "number": "4.3.1",
    "title": "Customer Request and Job Reference",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Customer / Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "The customer submits a formal request through the Gorod Logistics customer portal against the relevant Job Number."
            }
          ],
          [
            {
              "text": "The customer selects the applicable activity and provides the Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Admin verifies the request against the cargo records in ERP."
            }
          ],
          [
            {
              "text": "Admin creates an activity request and links it to the original Job Number."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-2-activity-details-and-document-collection",
    "number": "4.3.2",
    "title": "Activity Details and Document Collection",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Admin obtains the following details, as applicable:"
          }
        ]
      }
    ]
  },
  {
    "id": "sop-activities-under-section-64",
    "number": "",
    "title": "Activities under Section 64",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Date of activity."
            }
          ],
          [
            {
              "text": "Description of activity."
            }
          ],
          [
            {
              "text": "Purpose of activity."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Section 64 covers inspection, dealing with containers to prevent loss, deterioration or damage,"
          },
          {
            "text": "sorting goods, and showing goods for sale"
          },
          {
            "text": ", labelling, sorting, repacking"
          },
          {
            "text": ". "
          }
        ]
      }
    ]
  },
  {
    "id": "sop-samples-drawn-by-government-agencies",
    "number": "",
    "title": "Samples drawn by government agencies",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Date of sample drawn."
            }
          ],
          [
            {
              "text": "Description and quantity of sample."
            }
          ],
          [
            {
              "text": "Unit of quantity."
            }
          ],
          [
            {
              "text": "Purpose of sampling."
            }
          ],
          [
            {
              "text": "Agency details and sampling order/reference, where available."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-extension-of-warehousing-period",
    "number": "",
    "title": "Extension of warehousing period",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Description of goods."
            }
          ],
          [
            {
              "text": "Current warehousing expiry date."
            }
          ],
          [
            {
              "text": "Requested extension period."
            }
          ],
          [
            {
              "text": "Reason for extension."
            }
          ],
          [
            {
              "text": "Supporting application and the extension order/letter once approved."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-bank-guarantees",
    "number": "",
    "title": "Bank guarantees",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Description of goods covered by the guarantee."
            }
          ],
          [
            {
              "text": "Bank Guarantee amount."
            }
          ],
          [
            {
              "text": "Expiry date."
            }
          ],
          [
            {
              "text": "Copy of the Bank Guarantee and relevant supporting documents."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-relinquishment-of-goods",
    "number": "",
    "title": "Relinquishment of goods",
    "level": 4,
    "blocks": [
      {
        "kind": "list",
        "ordered": false,
        "items": [
          [
            {
              "text": "Into-Bond BOE number and date."
            }
          ],
          [
            {
              "text": "Description of goods."
            }
          ],
          [
            {
              "text": "Available quantity."
            }
          ],
          [
            {
              "text": "Quantity proposed for relinquishment."
            }
          ],
          [
            {
              "text": "Customer's written request and supporting documents."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Once Customer "
          },
          {
            "text": "sends"
          },
          {
            "text": " specific request on portal, "
          },
          {
            "text": "Admin checks document completeness and obtains corrections or missing information before processing the request."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-3-scope-confirmation-and-charges",
    "number": "4.3.3",
    "title": "Scope Confirmation and Charges",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team / Warehouse Manager / Operations Team"
          },
          {
            "text": "/Accounts Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "For physical handling activities, Admin obtains the work requirements and confirms the scope with Operations."
            }
          ],
          [
            {
              "text": "The scope must specify the activity, quantity, manpower, estimated time, equipment and materials required, such as labels, stickers or packaging materials."
            }
          ],
          [
            {
              "text": "Admin provides the applicable charges based on Gorod Logistics' published tariff or the "
            },
            {
              "text": "customized"
            },
            {
              "text": " scope of work."
            }
          ],
          [
            {
              "text": "The customer confirms the scope and charges."
            }
          ],
          [
            {
              "text": "Accounts"
            },
            {
              "text": " Team"
            },
            {
              "text": "raises"
            },
            {
              "text": " the "
            },
            {
              "text": "proforma "
            },
            {
              "text": "invoice for the confirmed services, including any applicable overtime charges if Customs Officer attendance outside normal working hours is required."
            }
          ],
          [
            {
              "text": "Any change in scope or additional work must be reviewed and commercially approved before execution."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-4-customs-notification-and-warehouse-keeper-approval",
    "number": "4.3.4",
    "title": "Customs Notification and Warehouse Keeper Approval",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Approval: Warehouse Keeper"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Admin notifies the concerned Customs Bond Officer by replying to the original receipt email thread, retaining the Job Reference Number in the subject."
            }
          ],
          [
            {
              "text": "The email includes the Into-Bond BOE reference, activity type, goods description, quantity, purpose, supporting documents and proposed date."
            }
          ],
          [
            {
              "text": "Admin coordinates with the Bond Officer to confirm whether inspection, attendance, written permission or any specific Customs procedure is required."
            }
          ],
          [
            {
              "text": "The Warehouse Keeper reviews the request and approves the operation after the required Customs confirmation and statutory permissions are in place."
            }
          ],
          [
            {
              "text": "For extension of warehousing, Admin records the applicable extension order and updates the approved extended date in ERP. Extensions must be processed under the applicable requirements of Section 61. "
            }
          ],
          [
            {
              "text": "For relinquishment, Admin ensures that the request is processed under the applicable provisions, including Section 68 where relevant, before updating the goods records. "
            }
          ],
          [
            {
              "text": "Admin records the approval and alerts Operations where physical activity is required."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Control rule: Email confirmation does not replace a formal Customs order or permission wherever one is legally required. Activities such as repacking, "
          },
          {
            "text": "relabeling"
          },
          {
            "text": " or processing must not automatically be treated as permitted under Section 64; the applicable Customs provisions must first be verified."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-5-operational-arrangements-and-execution",
    "number": "4.3.5",
    "title": "Operational Arrangements and Execution",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Operations "
            },
            {
              "text": "review"
            },
            {
              "text": " the approved scope and "
            },
            {
              "text": "arrange"
            },
            {
              "text": " the required manpower, work area, equipment and raw materials."
            }
          ],
          [
            {
              "text": "Operations "
            },
            {
              "text": "identify"
            },
            {
              "text": " the cargo using the Job Number and bin location."
            }
          ],
          [
            {
              "text": "Before commencing the activity, Operations verifies the cargo description, quantity and condition"
            },
            {
              "text": ", brings it to the value addon service zone to start the process."
            }
          ],
          [
            {
              "text": "Photographs and videos are taken before, during and after physical handling activities, as applicable."
            }
          ],
          [
            {
              "text": "Operations carries out the activity according to the approved scope and Customs instructions."
            }
          ],
          [
            {
              "text": "Where samples are drawn by government agencies, Operations records the details of the sampling event and assists with documentation as required."
            }
          ],
          [
            {
              "text": "Operations "
            },
            {
              "text": "record"
            },
            {
              "text": " the actual quantity handled, materials used, final condition and any discrepancy or damage in ERP."
            }
          ],
          [
            {
              "text": "Any activity outside the approved scope must be reported to Admin and the Warehouse Keeper before proceeding."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "For activities such as warehousing extension, Bank Guarantee recording or relinquishment that do not require physical handling, Operations involvement is limited to any necessary inventory verification."
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-3-6-erp-update-and-record-keeping",
    "number": "4.3.6",
    "title": "ERP Update and Record Keeping",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team / Warehouse Manager / Operations Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Admin updates the applicable activity details against the original Job Number and Into-Bond BOE."
            }
          ],
          [
            {
              "text": "The relevant records must include:"
            }
          ],
          [
            {
              "text": "Section 64 activity date, description and purpose."
            }
          ],
          [
            {
              "text": "Government agency sample date, description, quantity, unit and purpose."
            }
          ],
          [
            {
              "text": "Original warehousing expiry date and approved extension date."
            }
          ],
          [
            {
              "text": "Bank Guarantee details, amount and expiry date."
            }
          ],
          [
            {
              "text": "Available and relinquished quantities, where applicable."
            }
          ],
          [
            {
              "text": "Supporting requests, Customs correspondence, approvals, orders and digitally signed documents, where required, are uploaded to ERP or the applicable document system."
            }
          ],
          [
            {
              "text": "Operations "
            },
            {
              "text": "upload"
            },
            {
              "text": " the activity photographs/videos and completion details for physical handling activities."
            }
          ],
          [
            {
              "text": "Admin ensures that the information is available for the applicable monthly Customs warehouse return."
            }
          ],
          [
            {
              "text": "The activity is closed after all required approvals, records and inventory updates are completed."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-monthly-return-filing-icegate-form-a-and-form-b",
    "number": "4.4",
    "title": "Monthly Return Filing — ICEGATE Form A and Form B",
    "level": 2,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Objective:",
            "bold": true
          },
          {
            "text": " To ensure that Gorod Logistics files accurate and timely monthly warehouse returns through ICEGATE, obtains internal approval, submits the required supporting documents and records the filing acknowledgement in ERP."
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Scope:",
            "bold": true
          },
          {
            "text": " This procedure covers the preparation, verification, approval, filing and closure of the following monthly returns, as applicable. "
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Form A: Monthly return covering receipt, storage, handling/operations and removal of goods."
            }
          ],
          [
            {
              "text": "Form B: Monthly return covering goods for which the warehousing period is due to expire."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-1-monthly-data-collection-and-verification",
    "number": "4.4.1",
    "title": "Monthly Data Collection and Verification",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          },
          {
            "text": "/ Operation Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Compile the monthly details from ERP for all relevant Job Numbers and Into-Bond BOEs."
            }
          ],
          [
            {
              "text": "Cross-verify receipts, storage records, handling activities, sample "
            },
            {
              "text": "drawls"
            },
            {
              "text": ", removals, balances and other applicable particulars against the supporting records."
            }
          ],
          [
            {
              "text": "Identify the goods whose warehousing period is due to expire and compile the details required for Form B."
            }
          ],
          [
            {
              "text": "Verify that the quantities and balances are consistent with the previous returns and current warehouse inventory."
            }
          ],
          [
            {
              "text": "Identify discrepancies or missing information and coordinate with Operations or the concerned team for correction before preparing the returns."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-2-warehouse-keeper-review-and-approval",
    "number": "4.4.2",
    "title": "Warehouse Keeper Review and Approval",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Approval: Warehouse Keeper"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Submit the compiled Form A and Form B details to the Warehouse Keeper for review."
            }
          ],
          [
            {
              "text": "Obtain confirmation that the monthly records have been cross-verified and are ready for filing."
            }
          ],
          [
            {
              "text": "Correct any discrepancies identified during the review."
            }
          ],
          [
            {
              "text": "Proceed with filing only after the Warehouse Keeper's approval."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-3-icegate-return-preparation-and-filing",
    "number": "4.4.3",
    "title": "ICEGATE Return Preparation and Filing",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Log in to ICEGATE using the "
            },
            {
              "text": "authorized"
            },
            {
              "text": " warehouse account."
            }
          ],
          [
            {
              "text": "Navigate to Services → Warehouse → Warehouse Monthly Return."
            }
          ],
          [
            {
              "text": "Select the relevant return month and year and prepare Form A and Form B, as applicable."
            }
          ],
          [
            {
              "text": "Download and complete the prescribed ICEGATE Excel/template format where file-based filing is enabled, or complete the prescribed webform where that filing method is used."
            }
          ],
          [
            {
              "text": "Verify all entries against the approved monthly records before submission."
            }
          ],
          [
            {
              "text": "Upload the completed return and any applicable supporting documents, where the portal permits or requires them."
            }
          ],
          [
            {
              "text": "Submit the return through ICEGATE and save the filing acknowledgement/reference number."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Filing deadlines: Form A must be filed within 10 days after the close of the relevant month. Form B must be filed on or before the 10th day of the month immediately preceding the month in which the warehousing period expires. "
          }
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-4-customs-email-and-acknowledgement-recording",
    "number": "4.4.4",
    "title": "Customs Email and Acknowledgement Recording",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Send an email to the concerned Customs Bond Officer confirming submission of the monthly return through ICEGATE."
            }
          ],
          [
            {
              "text": "Include the return month, form type, filing reference and relevant supporting documents, where applicable."
            }
          ],
          [
            {
              "text": "Save the ICEGATE acknowledgement and Customs email correspondence against the relevant monthly return record in ERP."
            }
          ],
          [
            {
              "text": "Update the filing status, submission date, acknowledgement/reference number and supporting document details in ERP."
            }
          ],
          [
            {
              "text": "Track any queries or corrections requested by Customs and update the return records accordingly."
            }
          ]
        ]
      }
    ]
  },
  {
    "id": "sop-4-4-5-filing-closure-and-record-keeping",
    "number": "4.4.5",
    "title": "Filing Closure and Record Keeping",
    "level": 3,
    "blocks": [
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Responsible: Admin Team"
          }
        ]
      },
      {
        "kind": "list",
        "ordered": true,
        "items": [
          [
            {
              "text": "Confirm that all applicable Form A and Form B returns for the relevant month have been submitted successfully."
            }
          ],
          [
            {
              "text": "Verify that the ICEGATE acknowledgements and related email correspondence are saved in ERP."
            }
          ],
          [
            {
              "text": "Ensure that the approved monthly data, filed returns and supporting documents are retained in the monthly compliance records."
            }
          ],
          [
            {
              "text": "Mark the monthly return filing as complete in ERP once submission and record keeping are confirmed."
            }
          ]
        ]
      },
      {
        "kind": "paragraph",
        "runs": [
          {
            "text": "Control rule: Before submitting a return for a new month, Admin must verify that the applicable returns for previous months have been filed. Any pending return, portal error or unresolved discrepancy must be escalated to the Warehouse Keeper. "
          }
        ]
      }
    ]
  }
];
