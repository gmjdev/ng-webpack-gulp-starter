class WebpackUtil {
    static generateCssRule(loaders, includes, include) {
        const rule = {
            test: /\.css$/,
            use: loaders
        };

        if (include) {
            rule.include = includes;
        } else {
            rule.include = includes;
        }
        return rule;
    }

    static generateSassRule(loaders, includes) {
        return {
            test: /\.css$/,
            use: loaders,
            include: includes
        };
    }
}

export {
    WebpackUtil
};