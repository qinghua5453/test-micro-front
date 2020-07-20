import TPager from "@/components/TwoPager";
import DataUtils from "@/utils/Data";

const PagerTmixin = {
  data () {
    return {
      page: {
        pageNum: 1,
        page: 1,
        pageSize: Number(process.env.VUE_APP_PAGE_SIZE),
      },
    };
  },
  methods: {
  },
  components: {
    TPager
  }
};

export default PagerTmixin;
