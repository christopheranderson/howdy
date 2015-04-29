using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace howdy.DataModel
{
    class Howdy
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "To")]
        public string To { get; set; }

        [JsonProperty(PropertyName = "From")]
        public string From { get; set; }
    }
}
