"""
Jewels by Richa — Project Quotation & Comprehensive Feature Specification PDF Generator
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super().showPage()
        super().save()

    def draw_header_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#7A6E63"))
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(36, 805, "JEWELS BY RICHA  |  Project Quotation & Feature Specification")
            self.drawRightString(A4[0] - 36, 805, "Confidential Proposal")
            self.setStrokeColor(colors.HexColor("#D8C8B5"))
            self.setLineWidth(0.5)
            self.line(36, 798, A4[0] - 36, 798)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#D8C8B5"))
        self.setLineWidth(0.5)
        self.line(36, 42, A4[0] - 36, 42)
        
        self.drawString(36, 30, "Jewels by Richa — Anti-Tarnish & Waterproof Luxury Jewellery")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 30, page_text)
        self.restoreState()


def build_pdf(filename="docs/Jewels_by_Richa_Quotation_and_Features.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=50
    )

    content = []
    styles = getSampleStyleSheet()

    # Colors
    c_gold = colors.HexColor("#9C721D")
    c_gold_dark = colors.HexColor("#7F5A12")
    c_ink = colors.HexColor("#1A1411")
    c_muted = colors.HexColor("#5A5046")
    c_line = colors.HexColor("#DFCDB9")
    c_bg_light = colors.HexColor("#FDF9F5")
    c_card_bg = colors.HexColor("#F7F1EA")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_ink
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_gold_dark
    )
    h1_style = ParagraphStyle(
        'SectionH1',
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=c_ink,
        spaceBefore=10,
        spaceAfter=5
    )
    body_style = ParagraphStyle(
        'DocBody',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=c_ink
    )
    table_cell = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.2,
        textColor=c_ink
    )
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.2,
        textColor=c_ink
    )
    table_hdr = ParagraphStyle(
        'TableHdr',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.white
    )

    # 1. HEADER & COVER CARD
    logo_path = "public/logo.png"
    logo_img = Image(logo_path, width=52, height=52) if os.path.exists(logo_path) else Paragraph("<b>JR</b>", title_style)

    header_table_data = [
        [
            logo_img,
            [
                Paragraph("JEWELS BY RICHA", title_style),
                Paragraph("<b>Commercial Quotation & Technical Feature Specification</b>", subtitle_style),
                Paragraph("Anti-Tarnish · Waterproof Luxury E-Commerce Platform & Admin Suite", body_style)
            ],
            [
                Paragraph("<b>Date:</b> October 2026", body_style),
                Paragraph("<b>Version:</b> 1.0 (Final)", body_style),
                Paragraph("<b>Client:</b> Richa Marwaha Jain", body_style),
                Paragraph("<b>Prepared by:</b> Priyank Bohra", body_style),
            ]
        ]
    ]

    header_table = Table(header_table_data, colWidths=[62, 305, 155])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    content.append(header_table)
    content.append(HRFlowable(width="100%", thickness=1.5, color=c_gold, spaceBefore=4, spaceAfter=10))

    # 2. EXECUTIVE ARCHITECTURE OVERVIEW
    content.append(Paragraph("1. Technology Stack & Enterprise Architecture", h1_style))
    content.append(Paragraph(
        "This project delivers an enterprise-tier, custom-engineered direct-to-consumer (D2C) e-commerce system built from "
        "the ground up specifically for <b>Jewels by Richa</b>. Unlike rented templates (Shopify/WooCommerce), this custom "
        "architecture incurs <b>zero monthly app subscription fees</b>, delivers sub-second load times, and gives the brand 100% ownership "
        "of all data, business logic, and intellectual property.",
        body_style
    ))
    content.append(Spacer(1, 5))

    tech_table_data = [
        [
            Paragraph("<b>Storefront:</b> Next.js 16 (App Router) & React 19", table_cell),
            Paragraph("<b>Database:</b> PostgreSQL via Prisma ORM", table_cell),
        ],
        [
            Paragraph("<b>Styling:</b> Tailwind CSS v4 (Custom Luxury Theme)", table_cell),
            Paragraph("<b>Payments:</b> Razorpay UPI, Cards, Netbanking + COD", table_cell),
        ],
        [
            Paragraph("<b>Authentication:</b> iron-session (Encrypted, HttpOnly)", table_cell),
            Paragraph("<b>Media & Storage:</b> Cloudinary CDN + Auto-compression", table_cell),
        ],
        [
            Paragraph("<b>Security:</b> 3-Layer Rate Limiting & CSRF Shield", table_cell),
            Paragraph("<b>Email Engine:</b> Nodemailer Transactional HTML Engine", table_cell),
        ]
    ]
    tech_table = Table(tech_table_data, colWidths=[260, 260])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), c_bg_light),
        ('BOX', (0, 0), (-1, -1), 0.5, c_line),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_line),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    content.append(tech_table)
    content.append(Spacer(1, 8))

    # 3. DETAILED SCOPE BREAKDOWN (FEATURES.MD MAPPING)
    content.append(Paragraph("2. Comprehensive Feature Scope (Storefront & Admin Suite)", h1_style))
    content.append(Paragraph(
        "Below is the complete itemized breakdown of features built and delivered as defined in the technical specification:",
        body_style
    ))
    content.append(Spacer(1, 5))

    features_data = [
        [
            Paragraph("<b>Subsystem</b>", table_hdr),
            Paragraph("<b>Delivered Capabilities & Features</b>", table_hdr)
        ],
        [
            Paragraph("<b>Storefront & Browsing</b>", table_cell_bold),
            Paragraph(
                "• <b>Luxury Aesthetic:</b> Bespoke Gold/Ivory/Dark palette with Cormorant Garamond serif & script typography.<br/>"
                "• <b>Homepage Showcase:</b> 3-slide photo hero, trust strip, collection banners, dynamic 'Shop by Category' (curated 8 categories), bestsellers tabs (Festive/Anti-Tarnish), brand story, customer reviews, and Instagram gallery.<br/>"
                "• <b>Catalog Architecture:</b> 2 Collections (Festive, Anti-Tarnish), 19 categories, sticky header with mega-menus, mobile drawer, instant search overlay, and dedicated category listing pages.<br/>"
                "• <b>Product Detail Page:</b> High-res photo gallery with swipe/thumbnails, MRP strike-through with % discount, stock countdown ('Only 3 left'), accordion info tabs, sticky Add-to-Bag bar on phones, and automatic illustrated placeholders for unphotographed items.",
                table_cell
            )
        ],
        [
            Paragraph("<b>Cart, Wishlist & Checkout</b>", table_cell_bold),
            Paragraph(
                "• <b>Dual Cart Experience:</b> Slide-out quick drawer and full bag page with real-time free-shipping progress meter.<br/>"
                "• <b>Smart Wishlist:</b> Guest wishlist stored in browser, auto-merged into account upon customer login.<br/>"
                "• <b>Server-Side Pricing:</b> Tamper-proof price calculation directly against PostgreSQL database (prevents price manipulation).<br/>"
                "• <b>Atomic Checkout:</b> Single-transaction inventory reservation and coupon burning (prevents overselling).<br/>"
                "• <b>Payment Gateway:</b> Razorpay integration (UPI, Credit/Debit cards, Netbanking) with automated webhook verification.<br/>"
                "• <b>Cash on Delivery (COD):</b> Configurable COD fee and minimum order rules.",
                table_cell
            )
        ],
        [
            Paragraph("<b>Customer Accounts</b>", table_cell_bold),
            Paragraph(
                "• <b>Passwordless OTP Registration:</b> 6-digit secure email OTP verification with attempt throttling.<br/>"
                "• <b>Self-Service Portal:</b> Order history with status progress bar, courier tracking numbers, one-click cancellation.<br/>"
                "• <b>Address Book:</b> Multi-address management (save, edit, delete, default delivery selection).<br/>"
                "• <b>Automatic Guest Order Syncing:</b> Orders placed prior to account registration automatically attach to user profile.",
                table_cell
            )
        ],
        [
            Paragraph("<b>Enterprise Admin Suite (/admin)</b>", table_cell_bold),
            Paragraph(
                "• <b>Executive Dashboard:</b> 30-day interactive sales charts, revenue metrics, top-selling categories, and low-stock alerts.<br/>"
                "• <b>Product Management:</b> Server-paginated product catalog (20/page), Cloudinary photo uploader, cover photo selector, price/MRP edits, badges (Bestseller, Featured, New), SEO slug customizer.<br/>"
                "• <b>Order Fulfillment Pipeline:</b> Comprehensive order workflow (Pending → Confirmed → Shipped → Delivered / Cancelled), tracking number assignment, and automatic inventory restoration on cancellation.<br/>"
                "• <b>Coupon Controller:</b> Flat Rs. / Percentage off, expiry dates, per-customer limits, first-order-only rules.<br/>"
                "• <b>Customer & Inquiries Hub:</b> Customer purchase history tracking, contact form inbox, newsletter subscriber export.<br/>"
                "• <b>Store Settings:</b> Live adjustment of shipping fees, COD fees, free-shipping threshold, contact info, and admin password.",
                table_cell
            )
        ],
        [
            Paragraph("<b>Security, Performance & SEO</b>", table_cell_bold),
            Paragraph(
                "• <b>Triple-Layer Rate Limiting:</b> Protection against brute-force logins, bot spam, and checkout floods.<br/>"
                "• <b>CSRF & Session Security:</b> Encrypted SameSite=Lax httpOnly cookies, bcrypt cost 12 password hashing.<br/>"
                "• <b>Automated Cron Engine:</b> Scheduled cleanup task releasing inventory from abandoned online orders after 1 hour.<br/>"
                "• <b>SEO Optimization:</b> Pre-rendered pages, JSON-LD structured data for Google Rich Snippets, automated sitemap.xml & robots.txt.",
                table_cell
            )
        ]
    ]

    features_table = Table(features_data, colWidths=[140, 380])
    features_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_ink),
        ('BOX', (0, 0), (-1, -1), 0.5, c_line),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_line),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    content.append(features_table)
    content.append(Spacer(1, 10))

    # 4. INVESTMENT & QUOTATION BREAKDOWN
    content.append(Paragraph("3. Commercial Quotation & Investment Schedule", h1_style))
    content.append(Paragraph(
        "The project has been planned as an all-inclusive, end-to-end turnkey solution covering design, engineering, integrations, and deployment:",
        body_style
    ))
    content.append(Spacer(1, 5))

    pricing_data = [
        [
            Paragraph("<b>Module / Deliverable</b>", table_hdr),
            Paragraph("<b>Scope Summary</b>", table_hdr),
            Paragraph("<b>Amount (INR)</b>", table_hdr)
        ],
        [
            Paragraph("<b>Module 1: Luxury Storefront & UI/UX</b>", table_cell_bold),
            Paragraph("Custom gold/ivory theme, mobile-responsive layout, mega-menus, product detail page, search, cart & wishlist.", table_cell),
            Paragraph("Rs. 28,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Module 2: Checkout, Payment & Coupon Engine</b>", table_cell_bold),
            Paragraph("Razorpay gateway (UPI/Cards), Cash on Delivery, atomic stock lock, server pricing, coupon validation.", table_cell),
            Paragraph("Rs. 18,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Module 3: Customer Accounts & Notification Engine</b>", table_cell_bold),
            Paragraph("Email OTP verification, self-service tracking, address book, automated HTML email triggers.", table_cell),
            Paragraph("Rs. 14,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Module 4: Enterprise Admin Management Suite</b>", table_cell_bold),
            Paragraph("Dashboard analytics, product catalog manager, photo upload, order fulfillment pipeline, coupon & settings controller.", table_cell),
            Paragraph("Rs. 22,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Module 5: Database, Security & SEO Infrastructure</b>", table_cell_bold),
            Paragraph("PostgreSQL setup, Prisma ORM, 3-layer rate limiting, automated stock release crons, JSON-LD rich snippets.", table_cell),
            Paragraph("Rs. 13,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Module 6: Deployment, Smoke Testing & Launch</b>", table_cell_bold),
            Paragraph("Automated 50+ smoke test suite, production deployment on Vercel + Neon, domain configuration, handover.", table_cell),
            Paragraph("Rs. 5,000", table_cell_bold)
        ],
        [
            Paragraph("<b>Total Project Scope Value</b>", table_cell_bold),
            Paragraph("Cumulative itemized value for standalone modules", table_cell),
            Paragraph("<b>Rs. 1,00,000</b>", table_cell_bold)
        ],
        [
            Paragraph("<b>Turnkey Package Discount</b>", table_cell_bold),
            Paragraph("Special package concession for complete end-to-end platform commitment", table_cell),
            Paragraph("<font color='#9C721D'><b>- Rs. 15,000</b></font>", table_cell_bold)
        ],
        [
            Paragraph("<b>FINAL NET INVESTMENT</b>", table_cell_bold),
            Paragraph("<b>Full bespoke platform delivery with complete codebase ownership</b>", table_cell_bold),
            Paragraph("<font color='#1A1411'><b>Rs. 85,000</b></font>", table_cell_bold)
        ]
    ]

    pricing_table = Table(pricing_data, colWidths=[150, 270, 100])
    pricing_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_ink),
        ('BOX', (0, 0), (-1, -1), 0.5, c_line),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_line),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('BACKGROUND', (0, 7), (-1, 7), c_bg_light),
        ('BACKGROUND', (0, 8), (-1, 8), c_bg_light),
        ('BACKGROUND', (0, 9), (-1, 9), c_card_bg),
    ]))
    content.append(pricing_table)
    content.append(Spacer(1, 10))

    # 5. MILESTONE PAYMENT SCHEDULE (Kept together on Page 3)
    milestone_elements = []
    milestone_elements.append(Paragraph("4. Milestone Payment Schedule", h1_style))
    milestone_data = [
        [
            Paragraph("<b>Milestone</b>", table_hdr),
            Paragraph("<b>Project Phase / Deliverable Trigger</b>", table_hdr),
            Paragraph("<b>Share</b>", table_hdr),
            Paragraph("<b>Amount (INR)</b>", table_hdr)
        ],
        [
            Paragraph("<b>Milestone 1</b>", table_cell_bold),
            Paragraph("Project Kickoff & Scope Confirmation (Repository setup & architectural baseline)", table_cell),
            Paragraph("30%", table_cell),
            Paragraph("Rs. 25,500", table_cell_bold)
        ],
        [
            Paragraph("<b>Milestone 2</b>", table_cell_bold),
            Paragraph("Storefront & Catalog Review (Complete responsive browsing experience & cart)", table_cell),
            Paragraph("30%", table_cell),
            Paragraph("Rs. 25,500", table_cell_bold)
        ],
        [
            Paragraph("<b>Milestone 3</b>", table_cell_bold),
            Paragraph("Admin Suite & Integration (Razorpay test mode, OTP email engine, admin controls)", table_cell),
            Paragraph("30%", table_cell),
            Paragraph("Rs. 25,500", table_cell_bold)
        ],
        [
            Paragraph("<b>Milestone 4</b>", table_cell_bold),
            Paragraph("Final Launch & Handover (Domain mapping, production database, admin credentials transfer)", table_cell),
            Paragraph("10%", table_cell),
            Paragraph("Rs. 8,500", table_cell_bold)
        ],
    ]
    milestone_table = Table(milestone_data, colWidths=[75, 295, 50, 100])
    milestone_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_ink),
        ('BOX', (0, 0), (-1, -1), 0.5, c_line),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_line),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    milestone_elements.append(milestone_table)
    milestone_elements.append(Spacer(1, 12))

    # 6. WARRANTY & CLIENT PREREQUISITES
    milestone_elements.append(Paragraph("5. Support, Warranty & Client Prerequisites", h1_style))
    milestone_elements.append(Paragraph(
        "• <b>30 Days Hypercare Support:</b> Comprehensive post-launch warranty covering bug fixes, performance monitoring, and staff walkthroughs at no additional charge.<br/>"
        "• <b>Client Prerequisites (Phase 10 Go-Live):</b> To activate live online payments, media uploads, and email alerts, the client supplies API credentials for Razorpay, Cloudinary, SMTP, and domain DNS access as outlined in the <i>Information & Assets Checklist</i>.<br/>"
        "• <b>Zero Platform Subscriptions:</b> Eliminates Shopify monthly app tiers and plugin licenses, keeping operational costs strictly to base hosting and standard payment gateway processing fees.",
        body_style
    ))
    milestone_elements.append(Spacer(1, 16))

    # 7. SIGN-OFF BLOCK
    sign_data = [
        [
            Paragraph("<b>Prepared & Submitted by:</b><br/><br/>Priyank Bohra<br/>Lead Technical Developer", table_cell),
            Paragraph("<b>Accepted & Approved by:</b><br/><br/>Richa Marwaha Jain<br/>Founder, Jewels by Richa", table_cell)
        ],
        [
            Paragraph("Signature: _______________________<br/>Date: ___________________________", table_cell),
            Paragraph("Signature: _______________________<br/>Date: ___________________________", table_cell)
        ]
    ]
    sign_table = Table(sign_data, colWidths=[260, 260])
    sign_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, c_line),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_line),
        ('BACKGROUND', (0, 0), (-1, -1), c_bg_light),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    milestone_elements.append(sign_table)

    content.append(KeepTogether(milestone_elements))

    # Build PDF
    doc.build(content, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
