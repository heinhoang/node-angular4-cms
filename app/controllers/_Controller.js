// class Controller {
//     constructor(Model, { req, res, next }, opts) {
//         return this.getOpts(Model, { req, res, next }, opts);
//     }

//     /**
//      * Get queries, params, ... and assign to opts.
//      * Expect opts to be
//      * {
//      *      query: {
//      *          find: {
//      *              name: '',
//      *              email
//      *          },
//      *          limit: {
//      *              limited: {
//      *                  type: Int,
//      *                  default: 10
//      *              }
//      *          },
//      *          select: {
//      *              fields: {
//      *                  default: 'name email',
//      *                  validate: (fields) => '' + fields
//      *              }
//      *          },
//      *      }
//      * }
//      * @param {Object} router req, res, next 
//      * @param {Object} opts 
//      */
//     getOpts(Model, { req, res, next }, opts) {
//         let parse;
//         // for (let key in opts) {
//         //     for (let subKey in opts[key]) {
//         //         for (let subSubKey in opts[key][subKey]) {
//         //             if (methodOpt === 'undefined') methodOpt = '';
//         //             if (typeof methodOpt === 'object') {
//         //                 // get parse function
//         //                 parse = typeof methodOpt.parse === 'function' ? methodOpt.parse : false;
//         //                 // get option from query, param,...
//         //                 methodOpt = req[key][subKey][subSubKey] ? req[key][subKey][subSubKey] : methodOpt.default || '';
//         //                 // parse the result
//         //                 if (methodOpt.type === 'Int') methodOpt = parseInt(methodOpt, 10);
//         //                 if (methodOpt.type === 'Number') methodOpt = +methodOpt;
//         //                 if (methodOpt.type === 'String') methodOpt = '' + methodOpt;
//         //                 parse && parse(methodOpt);
//         //             }
//         //         }
//         //     }
//         // }
//         let controller = Model;
//         for (const [key, reqTypes] of opts) {
//             for (const [modelMethods, modelMethodsOpts] of reqTypes) {
//                 for (let [subSubKey, methodOpt] of modelMethodsOpts) {
//                     if (methodOpt === 'undefined') methodOpt = '';
//                     if (typeof methodOpt === 'object') {
//                         // get parse function
//                         parse = typeof methodOpt.parse === 'function' ? methodOpt.parse : false;
//                         // get option from query, param,...
//                         methodOpt = req[key][subSubKey] ? req[key][subSubKey] : methodOpt.default || '';
//                         // parse the result
//                         if (methodOpt.type === 'Int') methodOpt = parseInt(methodOpt, 10);
//                         if (methodOpt.type === 'Number') methodOpt = +methodOpt;
//                         if (methodOpt.type === 'String') methodOpt = methodOpt.toString();
//                         if (parse !== '') parse(methodOpt);
//                     }
//                 }
//                 controller = controller[modelMethods](modelMethodsOpts);
//             }
//         }
//         return controller;
//     }

// }

module.exports = function Controller(Model, { req, res, next }, opts) {
    let parse;
    let controller = Model;
    for (const [key, reqTypes] of opts) {
        for (const [modelMethods, modelMethodsOpts] of reqTypes) {
            for (let [subSubKey, methodOpt] of modelMethodsOpts) {
                if (methodOpt === 'undefined') methodOpt = '';
                if (typeof methodOpt === 'object') {
                    // get parse function
                    parse = typeof methodOpt.parse === 'function' ? methodOpt.parse : false;
                    // get option from query, param,...
                    methodOpt = req[key][subSubKey] ? req[key][subSubKey] : methodOpt.default || '';
                    // parse the result
                    if (methodOpt.type === 'Int') methodOpt = parseInt(methodOpt, 10);
                    if (methodOpt.type === 'Number') methodOpt = +methodOpt;
                    if (methodOpt.type === 'String') methodOpt = methodOpt.toString();
                    if (parse !== '') parse(methodOpt);
                }
            }
            controller = controller[modelMethods](modelMethodsOpts);
        }
    }
    return controller;
};
