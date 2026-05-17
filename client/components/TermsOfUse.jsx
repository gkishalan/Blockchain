"use client";

import React, { useState } from "react";
import { MdOutlineGavel, MdExpandMore, MdExpandLess, MdEmail, MdSecurity, MdBlock, MdPrivacyTip, MdUpdate, MdHandshake } from "react-icons/md";
import { FaEthereum, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { BsFileEarmarkText } from "react-icons/bs";

const sections = [
    {
        id: 1,
        icon: <MdHandshake size={22} />,
        title: "Acceptance of Terms",
        content: `By accessing and using BlockChat ("the Application"), a decentralized blockchain-powered messaging platform, you agree to be bound by these Terms of Use ("Terms"). If you do not agree to these Terms, you must immediately discontinue use of the Application.

These Terms constitute a legally binding agreement between you ("User") and the BlockChat development team ("We," "Us," or "Our"). We reserve the right to update these Terms at any time, and continued use of the Application following any such update constitutes your acceptance of the revised Terms.

Last updated: May 2026.`,
    },
    {
        id: 2,
        icon: <BsFileEarmarkText size={20} />,
        title: "Description of Service",
        content: `BlockChat is a decentralized peer-to-peer chat application built on the Ethereum blockchain using Solidity smart contracts. The Application allows registered users to:

• Create and manage a blockchain-verified user account.
• Send and receive encrypted messages stored immutably on the blockchain.
• Add and manage contacts (Friends) through their Ethereum wallet addresses.
• View all registered users on the network.

The Application operates on a decentralized network and requires a compatible Web3 wallet (such as MetaMask) to function. All messages and user data are stored on-chain and are immutable by design.`,
    },
    {
        id: 3,
        icon: <FaEthereum size={20} />,
        title: "Blockchain & Wallet Usage",
        content: `BlockChat integrates with the Ethereum blockchain. By using the Application, you acknowledge and agree that:

• You are solely responsible for securing your Ethereum wallet, private keys, and seed phrases. We have no ability to recover lost credentials.
• All on-chain transactions (e.g., creating an account, sending messages) may incur gas fees payable in ETH, depending on the network.
• Blockchain transactions are irreversible. Once a message or account action is submitted to the chain, it cannot be undone.
• You are responsible for ensuring you are connected to the correct network (e.g., Localhost, Sepolia testnet) as configured by the application.
• We are not responsible for any loss of funds resulting from incorrect wallet usage, network misconfigurations, or smart contract interactions.`,
    },
    {
        id: 4,
        icon: <FaUserShield size={20} />,
        title: "User Eligibility & Account Registration",
        content: `To use BlockChat you must:

• Be at least 13 years of age. Users under 18 must have parental or guardian consent.
• Have a valid and functioning Ethereum-compatible wallet address.
• Choose a unique username that does not violate any third-party rights.

You agree not to impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity. We reserve the right to suspend or terminate accounts found to be in violation of this section without prior notice.`,
    },
    {
        id: 5,
        icon: <MdBlock size={22} />,
        title: "Prohibited Conduct",
        content: `You agree NOT to use BlockChat to:

• Transmit, distribute, or store any unlawful, harmful, threatening, abusive, harassing, defamatory, or obscene content.
• Engage in spamming, phishing, or any form of social engineering attacks.
• Attempt to disrupt, hack, or exploit vulnerabilities in the smart contract or the frontend application.
• Circumvent, disable, or otherwise interfere with security-related features of the Application.
• Use automated bots or scripts to interact with the Application without prior written consent.
• Violate any applicable local, national, or international law or regulation.

Violation of these prohibited conduct rules may result in immediate account suspension and may be reported to relevant authorities where applicable.`,
    },
    {
        id: 6,
        icon: <MdPrivacyTip size={22} />,
        title: "Privacy & Data",
        content: `BlockChat is a decentralized application. As such:

• All messages and account data you submit are stored on the Ethereum blockchain and are publicly accessible. Do not send sensitive personal information (e.g., passwords, financial details) via this platform.
• We do not operate centralized servers that collect or store your personal data beyond what is visible on-chain.
• Your Ethereum wallet address serves as your public identifier on the network.
• By using the Application, you acknowledge that your on-chain activity (account creation, messages sent/received) is publicly visible to any party with access to the blockchain.

We encourage users to review the privacy implications of public blockchain usage before sharing any information through the Application.`,
    },
    {
        id: 7,
        icon: <FaShieldAlt size={20} />,
        title: "Intellectual Property",
        content: `All source code, design assets, UI components, logos, and other intellectual property associated with BlockChat are the property of the BlockChat development team and are protected under applicable copyright and intellectual property laws.

You may not copy, reproduce, distribute, modify, create derivative works of, publicly display, or exploit any part of the Application without express written permission from us, except as permitted by open-source licenses where applicable.

Any feedback, suggestions, or ideas you provide regarding the Application may be used by us freely without any obligation to compensate you.`,
    },
    {
        id: 8,
        icon: <MdSecurity size={22} />,
        title: "Disclaimers & Limitation of Liability",
        content: `THE APPLICATION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not warrant that:
• The Application will be uninterrupted, error-free, or free of viruses or other harmful components.
• The results obtained from the use of the Application will be accurate or reliable.
• Smart contracts are free from bugs or vulnerabilities, though all reasonable efforts have been made to audit and test them.

TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APPLICATION.`,
    },
    {
        id: 9,
        icon: <MdUpdate size={22} />,
        title: "Changes to Terms",
        content: `We reserve the right to modify these Terms of Use at any time. When we do, we will update the "Last updated" date at the top of these Terms. It is your responsibility to review these Terms periodically for any changes.

Your continued use of the Application after any changes to these Terms constitutes your acceptance of the new Terms. If you do not agree with the updated Terms, you must stop using the Application immediately.

For major changes, we will endeavour to provide prominent notice within the Application.`,
    },
];

const TermsOfUse = () => {
    const [openSection, setOpenSection] = useState(null);

    const toggle = (id) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="TermsOfUse">
            {/* Hero */}
            <div className="TermsOfUse_hero">
                <div className="TermsOfUse_hero_icon">
                    <MdOutlineGavel size={44} />
                </div>
                <h1>Terms of Use</h1>
                <p>Please read these terms carefully before using BlockChat. By accessing the application, you agree to be bound by the conditions outlined below.</p>
                <span className="TermsOfUse_badge">Effective: May 2026</span>
            </div>

            {/* Accordion Sections */}
            <div className="TermsOfUse_sections">
                {sections.map((s) => (
                    <div
                        key={s.id}
                        className={`TermsOfUse_section ${openSection === s.id ? "TermsOfUse_section_open" : ""}`}
                    >
                        <button
                            className="TermsOfUse_section_header"
                            onClick={() => toggle(s.id)}
                            aria-expanded={openSection === s.id}
                            id={`terms-section-${s.id}`}
                        >
                            <span className="TermsOfUse_section_icon">{s.icon}</span>
                            <span className="TermsOfUse_section_title">
                                {s.id}. {s.title}
                            </span>
                            <span className="TermsOfUse_section_chevron">
                                {openSection === s.id ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                            </span>
                        </button>
                        {openSection === s.id && (
                            <div className="TermsOfUse_section_body">
                                <p>{s.content}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Contact Card */}
            <div className="TermsOfUse_contact">
                <div className="TermsOfUse_contact_icon">
                    <MdEmail size={32} />
                </div>
                <h3>Have Questions or Inquiries?</h3>
                <p>
                    If you have any questions about these Terms of Use, need clarification on any section, or require assistance, please reach out to our support team. We&apos;re happy to help.
                </p>
                <a
                    href="mailto:ytubeai777@gmail.com"
                    className="TermsOfUse_contact_email"
                    id="terms-contact-email"
                >
                    <MdEmail size={18} />
                    ytubeai777@gmail.com
                </a>
            </div>
        </div>
    );
};

export default TermsOfUse;
