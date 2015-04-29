using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace howdy.DataModel
{
    class User
    {
        public string Id { get; set; }

        [JsonProperty(PropertyName = "Name")]
        public string Name { get; set; }
    }
}
