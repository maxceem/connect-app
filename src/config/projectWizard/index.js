import _ from 'lodash'
import typeToSpecification from '../projectSpecification/typeToSpecification'

const products = {
  App: {
    icon: 'product-cat-app',
    info: 'Build a phone, tablet, wearable, or desktop app',
    question: 'What do you need to develop?',
    id: 'app',
    aliases: ['all-apps'],
    subtypes: {
      App: {
        brief: 'Apps',
        details: 'Build apps for mobile, web, or wearables',
        icon: 'product-app-app',
        id: 'application_development',
        aliases: ['app']
      }
    }
  },
  Website: {
    icon: 'product-cat-website',
    info: 'Design and build the high-impact pages for your blog, online store, or company',
    question: 'What do you need to develop?',
    id: 'website',
    aliases: ['all-websites'],
    subtypes: {
      Website: {
        brief: 'Websites',
        details: 'Build responsive or regular websites',
        icon: 'product-website-website',
        id: 'website_development',
        aliases: ['website']
      }
    }
  },
  Chatbot: {
    icon: 'product-cat-chatbot',
    info: 'Build, train and test a custom conversation for your chatbot',
    question: 'What do you need to develop?',
    id: 'chatbot',
    aliases: ['all-chatbots'],
    subtypes: {
      'Watson Chatbot': {
        brief: 'Watson Chatbot',
        details: 'Build Chatbot using IBM Watson',
        icon: 'product-chatbot-watson',
        id: 'watson_chatbot',
        hidden: true
      },
      Chatbot: {
        brief: 'Chatbot',
        details: 'Build, train and test a custom conversation for your chat bot',
        icon: 'product-chatbot-chatbot',
        id: 'generic_chatbot',
        aliases: ['chatbot']
      }
    }
  },
  Design: {
    icon: 'product-cat-design',
    info: 'Pick the right design project for your needs - wireframes, visual, or other',
    question: 'What kind of design do you need?',
    id: 'visual_design',
    aliases: ['all-designs'],
    subtypes: {
      Wireframes: {
        brief: '10-15 screens',
        details: 'Plan and explore the navigation and structure of your app',
        icon: 'product-design-wireframes',
        id: 'wireframes',
        aliases: ['wireframes']
      },
      'App Visual Design - Concepts': {
        brief: '1-15 screens',
        details: 'Visualize and test your app requirements and ideas',
        icon: 'product-design-app-visual',
        id: 'visual_design_concepts',
        aliases: ['visual_design_concepts'],
        disabled: true
      },
      'Visual Design': {
        brief: '1-15 screens',
        details: 'Create development-ready designs',
        icon: 'product-design-app-visual',
        id: 'visual_design_prod',
        aliases: ['visual-design']
      },
      Infographic: {
        brief: 'Infographic',
        details: 'Present your data in an easy-to-understand and interesting way',
        icon: 'product-design-infographic',
        id: 'infographic',
        aliases: ['infographic'],
        disabled: true
      },
      'Other Design': {
        brief: 'other designs',
        details: 'Get help with other types of design',
        icon: 'product-design-other',
        id: 'generic_design',
        aliases: ['generic_design']
      }
    }
  },
  'Software Development' : {
    icon: 'product-cat-development',
    info: 'Get help with any part of your development lifecycle',
    question: 'What kind of development do you need?',
    id: 'app_dev',
    aliases: ['all-development'],
    subtypes: {
      'Front-end Prototype': {
        brief: '3-20 screens',
        details: 'Translate designs to a web (HTML/CSS/JavaScript) or mobile prototype',
        icon: 'product-dev-prototype',
        id: 'visual_prototype',
        aliases: ['visual-prototype'],
        disabled: true
      },
      'Front-end': {
        brief: '',
        details: 'Translate your designs into Web or Mobile front-end',
        icon: 'product-dev-front-end-dev',
        id: 'frontend_dev',
        aliases: ['frontend-development']
      },
      'Back-end & API': {
        brief: '',
        details: 'Build the server, DB, and API for your app',
        icon: 'product-dev-integration',
        id: 'api_dev',
        aliases: ['api-development']
      },
      'Development Integration': {
        brief: 'Tasks or adhoc',
        details: 'Get help with any part of your app or software',
        icon: 'product-dev-other',
        id: 'generic_dev',
        aliases: ['generic-development']
      }
    }
  },
  'Real World Testing': {
    icon: 'product-qa-crowd-testing',
    info: 'Exploratory Testing, Cross browser-device Testing',
    question: 'What kind of quality assurance (QA) do you need?',
    id: 'quality_assurance',
    aliases: ['all-quality-assurance'],
    subtypes: {
      'Real World Testing': {
        brief: 'TBD',
        details: 'Exploratory Testing, Cross browser-device Testing',
        icon: 'product-qa-crowd-testing',
        id: 'real_world_testing',
        aliases: ['real-world-testing']
      },
      'Mobility Testing': {
        brief: 'TBD',
        details: 'App Certification, Lab on Hire, User Sentiment Analysis',
        icon: 'product-qa-mobility-testing',
        id: 'mobility_testing',
        aliases: ['mobility-testing'],
        disabled: true
      },
      'Website Performance': {
        brief: 'TBD',
        details: 'Webpage rendering effiency, Load, Stress and Endurance Test',
        icon: 'product-qa-website-performance',
        id: 'website_performance',
        aliases: ['website-performance'],
        disabled: true
      },
      'Digital Accessability': {
        brief: 'TBD',
        details: 'Make sure you app or website conforms to all rules and regulations',
        icon: 'product-qa-digital-accessability',
        id: 'digital_accessability',
        aliases: ['digital-accessability'],
        disabled: true
      },
      'Open Source Automation': {
        brief: 'TBD',
        details: 'Exploratory testing, cross browser testing',
        icon: 'product-qa-os-automation',
        id: 'open_source_automation',
        aliases: ['open-source-automation'],
        disabled: true
      },
      'Consulting & Adivisory': {
        brief: 'TBD',
        details: 'Expert services to get your project covered end-to-end',
        icon: 'product-qa-consulting',
        id: 'consulting_adivisory',
        aliases: ['consulting-adivisory'],
        disabled: true
      }
    }
  }
}

export default products

// exports all project types as an array
export const projectTypes = _.mapValues(products, (p, key) => ({...p, name: key }) )

/**
 * Finds product for the given product id. It compares the given value against product id and aliases.
 *
 * @param {string}  productId    id of the product.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} product object from the catalouge
 */
export function findProduct(productId, aliasesOnly = false) {
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      const subType = products[pType].subtypes[prd]
      if ((subType.id === productId && !aliasesOnly) || (subType.aliases && subType.aliases.indexOf(productId) !== -1)) {
        return { ...subType, name: prd}
      }
    }
  }
}

/**
 * Finds project category for the given category id. It compares the given value against id and aliases.
 *
 * @param {string}  categoryId    id of the category.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} project category object from the catalouge
 */
export function findCategory(categoryId, aliasesOnly = false) {
  for(const key in products) {
    const product = products[key]
    if (!product.disabled && ((product.id === categoryId && !aliasesOnly) || (product.aliases && product.aliases.indexOf(categoryId) !== -1))) {
      return { ...product, name: key} 
    }
  }
  return null
}

/**
 * Finds products of the given category id. Never returns disabled products
 *
 * @param {string}  categoryId   id of the category.
 * @param {boolean} fetchHidden  flag to limit the hidden products
 *
 * @return {Array} non disabled products of the given category from the catalouge
 */
export function findProductsOfCategory(categoryId, fetchHidden = true) {
  for(const pType in products) {
    if (products[pType].id === categoryId) {
      const ret = []
      for(const prd in products[pType].subtypes) {
        const product = products[pType].subtypes[prd]
        if (!product.disabled && (fetchHidden || !product.hidden)) {
          ret.push({ ...products[pType].subtypes[prd], name: prd })
        }
      }
      return ret
    }
  }
}

/**
 * Finds project category for the given product id. It compares the given value against id and aliases.
 *
 * @param {string}  productId    id of the category.
 * @param {boolean} aliasesOnly  flag to limit the search to aliases only
 *
 * @return {object} project category object, from the catalouge, for the given product
 */
export function findProductCategory(productId, aliasesOnly = false) {
  if (productId === 'generic_dev') {
    return 'Development'
  }
  if (productId === 'generic_design') {
    return 'Design'
  }
  for(const pType in products) {
    for(const prd in products[pType].subtypes) {
      const subType = products[pType].subtypes[prd]
      if (!subType.disabled && ((subType.id === productId && !aliasesOnly) || (subType.aliases && subType.aliases.indexOf(productId) !== -1))) {
        return { ...products[pType], name: pType}
      }
    }
  }
}

/**
 * Finds field from the project creation template
 *
 * @param {string} product      id of the product. It should resolve to a template where search is to be made.
 * @param {string} sectionId    id of the section in the product template
 * @param {string} subSectionId id of the sub section under the section identified by sectionId
 * @param {string} fieldName    name of the field to be fetched
 *
 * @return {object} field from the template, if found, null otherwise
 */
export function getProjectCreationTemplateField(product, sectionId, subSectionId, fieldName) {
  let specification = 'topcoder.v1'
  if (product)
    specification = typeToSpecification[product]
  const sections = require(`../projectQuestions/${specification}`).basicSections
  const section = _.find(sections, {id: sectionId})
  let subSection = null
  if (subSectionId && section) {
    subSection = _.find(section.subSections, {id : subSectionId })
  }
  if (subSection) {
    if (subSectionId === 'questions') {
      return _.find(subSection.questions, { fieldName })
    }
    return subSection.fieldName === fieldName ? subSection : null
  }
  return null
}
